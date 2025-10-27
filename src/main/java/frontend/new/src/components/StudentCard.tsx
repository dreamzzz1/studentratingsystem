import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { RatingStars } from './RatingStars';
import { MessageCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface StudentCardProps {
  name: string;
  major: string;
  year: string;
  rating: number;
  totalReviews: number;
  recentTrend: 'up' | 'down' | 'stable';
  strengths: string[];
  onClick?: () => void;
}

export function StudentCard({
  name,
  major,
  year,
  rating,
  totalReviews,
  recentTrend,
  strengths,
  onClick
}: StudentCardProps) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="mb-1">{name}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {major} • {year}
              </p>
            </div>
            
            {recentTrend === 'up' && (
              <TrendingUp className="text-green-500" size={20} />
            )}
            {recentTrend === 'down' && (
              <TrendingDown className="text-red-500" size={20} />
            )}
          </div>
          
          <div className="mb-3">
            <RatingStars rating={rating} />
          </div>
          
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <MessageCircle size={16} />
            <span>{totalReviews} reviews</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {strengths.map((strength, index) => (
              <Badge key={index} variant="secondary">
                {strength}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
