import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RatingStars } from './RatingStars';
import { Star, Search, Plus, LogOut, Users, TrendingUp, Award } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner@2.0.3';

interface Student {
  id: string;
  name: string;
  major: string;
  year: string;
  averageRating: number;
  totalReviews: number;
  ratings: any[];
}

interface DashboardPageProps {
  accessToken: string;
  user: any;
  onLogout: () => void;
}

export function DashboardPage({ accessToken, user, onLogout }: DashboardPageProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [addRatingOpen, setAddRatingOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [initializingDemo, setInitializingDemo] = useState(false);

  // Форма добавления студента
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentMajor, setNewStudentMajor] = useState('');
  const [newStudentYear, setNewStudentYear] = useState('');

  // Форма добавления рейтинга
  const [ratingValue, setRatingValue] = useState(0);
  const [ratingCategory, setRatingCategory] = useState('');
  const [ratingComment, setRatingComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96443e58/students`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        console.error('Ошибка загрузки студентов');
        return;
      }

      const data = await response.json();
      setStudents(data.students || []);
    } catch (error) {
      console.error('Ошибка при загрузке студентов:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeDemoData = async () => {
    setInitializingDemo(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96443e58/init-demo`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Ошибка инициализации');
        return;
      }

      toast.success('Демо-данные успешно загружены');
      await loadStudents();
    } catch (error) {
      console.error('Ошибка при инициализации демо-данных:', error);
      toast.error('Ошибка при загрузке демо-данных');
    } finally {
      setInitializingDemo(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96443e58/students`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: newStudentName,
            major: newStudentMajor,
            year: newStudentYear,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Ошибка при добавлении студента');
        return;
      }

      toast.success('Студент успешно добавлен');
      setAddStudentOpen(false);
      setNewStudentName('');
      setNewStudentMajor('');
      setNewStudentYear('');
      await loadStudents();
    } catch (error) {
      console.error('Ошибка при добавлении студента:', error);
      toast.error('Ошибка при добавлении студента');
    }
  };

  const handleAddRating = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStudent) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-96443e58/ratings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            studentId: selectedStudent.id,
            rating: ratingValue,
            category: ratingCategory,
            comment: ratingComment,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.error || 'Ошибка при добавлении рейтинга');
        return;
      }

      toast.success('Рейтинг успешно добавлен');
      setAddRatingOpen(false);
      setSelectedStudent(null);
      setRatingValue(0);
      setRatingCategory('');
      setRatingComment('');
      await loadStudents();
    } catch (error) {
      console.error('Ошибка при добавлении рейтинга:', error);
      toast.error('Ошибка при добавлении рейтинга');
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.major.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const avgRating = students.length > 0
    ? students.reduce((sum, s) => sum + s.averageRating, 0) / students.length
    : 0;

  const totalReviews = students.reduce((sum, s) => sum + s.totalReviews, 0);

  const topStudents = students.filter(s => s.averageRating >= 4.5).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-lg">
                <Star className="text-white" size={24} fill="white" />
              </div>
              <div>
                <h1 className="text-xl">Система рейтинга студентов</h1>
                <p className="text-sm text-gray-600">
                  Добро пожаловать, {user?.user_metadata?.name || user?.email}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut size={16} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Всего студентов</p>
                <p className="text-3xl">{students.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Всего отзывов</p>
                <p className="text-3xl">{totalReviews}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Star className="text-purple-600" size={24} />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Средний рейтинг</p>
                <p className="text-3xl">{avgRating.toFixed(1)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
            </div>
          </Card>
        </div>

        {/* Поиск и действия */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Поиск студентов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Добавить студента
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить студента</DialogTitle>
                  <DialogDescription>
                    Добавьте нового студента в систему
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddStudent} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="studentName">Имя студента</Label>
                    <Input
                      id="studentName"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Иван Иванов"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="major">Специальность</Label>
                    <Input
                      id="major"
                      value={newStudentMajor}
                      onChange={(e) => setNewStudentMajor(e.target.value)}
                      placeholder="Компьютерные науки"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Курс</Label>
                    <Select value={newStudentYear} onValueChange={setNewStudentYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите курс" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Первый курс">Первый курс</SelectItem>
                        <SelectItem value="Второй курс">Второй курс</SelectItem>
                        <SelectItem value="Младший курс">Младший курс</SelectItem>
                        <SelectItem value="Старший курс">Старший курс</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={() => setAddStudentOpen(false)}>
                      Отмена
                    </Button>
                    <Button type="submit">Добавить</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {students.length === 0 && !loading && (
              <Button 
                variant="outline" 
                onClick={initializeDemoData}
                disabled={initializingDemo}
              >
                {initializingDemo ? 'Загрузка...' : 'Загрузить демо-данные'}
              </Button>
            )}
          </div>
        </div>

        {/* Список студентов */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Загрузка...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'Студенты не найдены' : 'Пока нет студентов'}
            </p>
            {!searchQuery && students.length === 0 && (
              <Button onClick={initializeDemoData} disabled={initializingDemo}>
                {initializingDemo ? 'Загрузка...' : 'Загрузить демо-данные'}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStudents.map((student) => {
              const initials = student.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase();

              return (
                <Card key={student.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="mb-1">{student.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {student.major} • {student.year}
                      </p>

                      <div className="mb-3">
                        <RatingStars rating={student.averageRating || 0} />
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {student.totalReviews} {student.totalReviews === 1 ? 'отзыв' : 'отзывов'}
                      </p>

                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedStudent(student);
                          setAddRatingOpen(true);
                        }}
                      >
                        <Plus size={14} className="mr-1" />
                        Добавить рейтинг
                      </Button>
                    </div>
                  </div>

                  {student.ratings && student.ratings.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm mb-2">Последние отзывы:</p>
                      {student.ratings.slice(-2).reverse().map((rating: any) => (
                        <div key={rating.id} className="text-sm mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <RatingStars rating={rating.rating} showNumber={false} size={14} />
                            <Badge variant="secondary" className="text-xs">
                              {rating.category}
                            </Badge>
                          </div>
                          {rating.comment && (
                            <p className="text-gray-600 text-xs">{rating.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Диалог добавления рейтинга */}
      <Dialog open={addRatingOpen} onOpenChange={setAddRatingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить рейтинг</DialogTitle>
            <DialogDescription>
              Оцените студента {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddRating} className="space-y-4 mt-4">
            <div>
              <Label>Рейтинг</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingValue(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={
                        star <= (hoverRating || ratingValue)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="category">Категория</Label>
              <Select value={ratingCategory} onValueChange={setRatingCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Командная работа">Командная работа</SelectItem>
                  <SelectItem value="Коммуникация">Коммуникация</SelectItem>
                  <SelectItem value="Техническая экспертиза">Техническая экспертиза</SelectItem>
                  <SelectItem value="Надежность">Надежность</SelectItem>
                  <SelectItem value="Лидерство">Лидерство</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="comment">Комментарий (необязательно)</Label>
              <Textarea
                id="comment"
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Поделитесь своим опытом..."
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setAddRatingOpen(false)}>
                Отмена
              </Button>
              <Button type="submit">Добавить рейтинг</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
