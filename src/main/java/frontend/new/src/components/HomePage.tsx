import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, Users, Shield, TrendingUp, Award, BarChart } from 'lucide-react';

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Герой секция */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center bg-white/20 p-4 rounded-2xl mb-6">
              <Star className="text-white" size={48} fill="white" />
            </div>
            <h1 className="text-5xl mb-6">Система рейтинга студентов</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Платформа для оценки и анализа академических достижений студентов. 
              Создавайте прозрачную систему оценивания, отслеживайте прогресс и 
              мотивируйте студентов на достижение лучших результатов.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={onGetStarted}
            >
              Начать работу
            </Button>
          </div>
        </div>
      </section>

      {/* Для чего нужен сайт */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Для чего нужна эта система?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Наша платформа помогает создать справедливую и прозрачную систему оценки студентов
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="text-blue-600" size={32} />
              </div>
              <h3 className="mb-3">Оценка товарищей по команде</h3>
              <p className="text-gray-600">
                Студенты могут оценивать друг друга после совместной работы над проектами, 
                что способствует развитию навыков командной работы
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={32} />
              </div>
              <h3 className="mb-3">Отслеживание прогресса</h3>
              <p className="text-gray-600">
                Преподаватели и студенты могут видеть динамику развития навыков, 
                выявлять сильные стороны и области для улучшения
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="text-green-600" size={32} />
              </div>
              <h3 className="mb-3">Прозрачная система</h3>
              <p className="text-gray-600">
                Все оценки сохраняются и доступны для просмотра, что обеспечивает 
                честность и объективность в процессе обучения
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Возможности */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-4">Возможности платформы</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="bg-blue-600 text-white p-3 rounded-lg h-fit">
                <BarChart size={24} />
              </div>
              <div>
                <h3 className="mb-2">Рейтинговая система</h3>
                <p className="text-gray-600">
                  Оценка по различным категориям: командная работа, техническая экспертиза, 
                  коммуникация, надёжность и лидерство
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-purple-600 text-white p-3 rounded-lg h-fit">
                <Award size={24} />
              </div>
              <div>
                <h3 className="mb-2">Система достижений</h3>
                <p className="text-gray-600">
                  Студенты с высокими рейтингами получают признание и мотивацию 
                  продолжать развиваться
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-green-600 text-white p-3 rounded-lg h-fit">
                <Users size={24} />
              </div>
              <div>
                <h3 className="mb-2">Поиск партнёров</h3>
                <p className="text-gray-600">
                  Находите лучших студентов для совместной работы над проектами, 
                  основываясь на их рейтингах и отзывах
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-orange-600 text-white p-3 rounded-lg h-fit">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="mb-2">Безопасность данных</h3>
                <p className="text-gray-600">
                  Все данные защищены, оценки анонимны, система предотвращает 
                  злоупотребления и необъективные отзывы
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center">
            <h2 className="text-3xl mb-6">Начните использовать систему сегодня</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Присоединяйтесь к современной системе оценки студентов и создайте 
              культуру взаимного уважения и развити��
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="text-base py-2 px-4 bg-white/20 text-white border-white/30">
                Анонимные отзывы
              </Badge>
              <Badge variant="secondary" className="text-base py-2 px-4 bg-white/20 text-white border-white/30">
                Объективная оценка
              </Badge>
              <Badge variant="secondary" className="text-base py-2 px-4 bg-white/20 text-white border-white/30">
                Простой интерфейс
              </Badge>
            </div>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={onGetStarted}
            >
              Зарегистрироваться бесплатно
            </Button>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            Система рейтинга студентов - создайте справедливую среду обучения
          </p>
        </div>
      </footer>
    </div>
  );
}
