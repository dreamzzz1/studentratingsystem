import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Регистрация нового пользователя
app.post('/make-server-96443e58/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Все поля обязательны для заполнения' }, 400);
    }

    // Проверяем, существует ли уже пользователь с таким email
    const existingUser = await kv.get(`user:${email}`);
    if (existingUser) {
      return c.json({ error: 'Пользователь с таким email уже зарегистрирован' }, 409);
    }

    // Создаем пользователя в Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Автоматическое подтверждение email
    });

    if (error) {
      console.error('Ошибка создания пользователя в Supabase Auth:', error);
      if (error.message.includes('already registered')) {
        return c.json({ error: 'Пользователь с таким email уже зарегистрирован' }, 409);
      }
      return c.json({ error: 'Ошибка при регистрации пользователя' }, 500);
    }

    // Сохраняем дополнительные данные пользователя в KV
    await kv.set(`user:${email}`, {
      id: data.user.id,
      email,
      name,
      createdAt: new Date().toISOString(),
    });

    return c.json({
      success: true,
      user: {
        id: data.user.id,
        email,
        name,
      },
    });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    return c.json({ error: 'Внутренняя ошибка сервера' }, 500);
  }
});

// Получение списка студентов
app.get('/make-server-96443e58/students', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
      return c.json({ error: 'Необходима авторизация' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Неверный токен авторизации' }, 401);
    }

    // Получаем список студентов из KV
    const students = await kv.getByPrefix('student:');
    
    return c.json({
      students: students.map((s) => s.value),
    });
  } catch (error) {
    console.error('Ошибка при получении списка студентов:', error);
    return c.json({ error: 'Ошибка при загрузке студентов' }, 500);
  }
});

// Добавление студента
app.post('/make-server-96443e58/students', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
      return c.json({ error: 'Необходима авторизация' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Неверный токен авторизации' }, 401);
    }

    const { name, major, year } = await c.req.json();

    if (!name || !major || !year) {
      return c.json({ error: 'Все поля обязательны' }, 400);
    }

    const studentId = crypto.randomUUID();
    const student = {
      id: studentId,
      name,
      major,
      year,
      ratings: [],
      averageRating: 0,
      totalReviews: 0,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    };

    await kv.set(`student:${studentId}`, student);

    return c.json({ student });
  } catch (error) {
    console.error('Ошибка при создании студента:', error);
    return c.json({ error: 'Ошибка при создании студента' }, 500);
  }
});

// Добавление рейтинга студенту
app.post('/make-server-96443e58/ratings', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
      return c.json({ error: 'Необходима авторизация' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Неверный токен авторизации' }, 401);
    }

    const { studentId, rating, category, comment } = await c.req.json();

    if (!studentId || !rating || !category) {
      return c.json({ error: 'Необходимо указать студента, рейтинг и категорию' }, 400);
    }

    if (rating < 1 || rating > 5) {
      return c.json({ error: 'Рейтинг должен быть от 1 до 5' }, 400);
    }

    // Получаем студента
    const student = await kv.get(`student:${studentId}`);
    if (!student) {
      return c.json({ error: 'Студент не найден' }, 404);
    }

    // Добавляем новый рейтинг
    const newRating = {
      id: crypto.randomUUID(),
      rating,
      category,
      comment: comment || '',
      userId: user.id,
      createdAt: new Date().toISOString(),
    };

    student.ratings.push(newRating);
    student.totalReviews = student.ratings.length;
    student.averageRating = student.ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / student.ratings.length;

    await kv.set(`student:${studentId}`, student);

    return c.json({ success: true, student });
  } catch (error) {
    console.error('Ошибка при добавлении рейтинга:', error);
    return c.json({ error: 'Ошибка при добавлении рейтинга' }, 500);
  }
});

// Инициализация демо-данных
app.post('/make-server-96443e58/init-demo', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
      return c.json({ error: 'Необходима авторизация' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Неверный токен авторизации' }, 401);
    }

    // Проверяем, есть ли уже студенты
    const existing = await kv.getByPrefix('student:');
    if (existing.length > 0) {
      return c.json({ message: 'Демо-данные уже существуют' });
    }

    const demoStudents = [
      {
        id: crypto.randomUUID(),
        name: 'Александр Иванов',
        major: 'Компьютерные науки',
        year: 'Старший курс',
        ratings: [
          { id: crypto.randomUUID(), rating: 5, category: 'Командная работа', comment: 'Отличный товарищ по команде!', userId: user.id, createdAt: new Date().toISOString() },
          { id: crypto.randomUUID(), rating: 4, category: 'Техническая экспертиза', comment: 'Хорошие знания', userId: user.id, createdAt: new Date().toISOString() },
        ],
        averageRating: 4.5,
        totalReviews: 2,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
      },
      {
        id: crypto.randomUUID(),
        name: 'Мария Петрова',
        major: 'Наука о данных',
        year: 'Младший курс',
        ratings: [
          { id: crypto.randomUUID(), rating: 5, category: 'Коммуникация', comment: 'Всегда на связи', userId: user.id, createdAt: new Date().toISOString() },
          { id: crypto.randomUUID(), rating: 5, category: 'Надежность', comment: 'Можно положиться', userId: user.id, createdAt: new Date().toISOString() },
        ],
        averageRating: 5,
        totalReviews: 2,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
      },
      {
        id: crypto.randomUUID(),
        name: 'Дмитрий Соколов',
        major: 'Программная инженерия',
        year: 'Старший курс',
        ratings: [
          { id: crypto.randomUUID(), rating: 4, category: 'Лидерство', comment: 'Хороший лидер проекта', userId: user.id, createdAt: new Date().toISOString() },
        ],
        averageRating: 4,
        totalReviews: 1,
        createdAt: new Date().toISOString(),
        createdBy: user.id,
      },
    ];

    for (const student of demoStudents) {
      await kv.set(`student:${student.id}`, student);
    }

    return c.json({ message: 'Демо-данные успешно созданы', count: demoStudents.length });
  } catch (error) {
    console.error('Ошибка при инициализации демо-данных:', error);
    return c.json({ error: 'Ошибка при создании демо-данных' }, 500);
  }
});

Deno.serve(app.fetch);
