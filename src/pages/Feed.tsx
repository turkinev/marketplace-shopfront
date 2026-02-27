import { useState } from "react";
import { PostCard, Post } from "@/components/PostCard";
import { subHours, subMinutes, subDays, format, isToday, isYesterday } from "date-fns";
import { ru } from "date-fns/locale";

const now = new Date();

const initialPosts: Post[] = [
  {
    id: "1",
    author: { name: "Андрей Петров", avatar: "" },
    date: subHours(now, 2),
    text: "🚀 **Большое обновление!**\n\nМы рады сообщить о запуске новой версии платформы. Основные изменения:\n\n• Полностью переработанный интерфейс\n• Скорость загрузки увеличена в 3 раза\n• Новая система уведомлений\n\nПодробнее читайте в нашем блоге: https://example.com/blog/update",
    images: [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    ],
    reactions: [
      { emoji: "👍", label: "like", count: 24, isActive: false },
      { emoji: "❤️", label: "heart", count: 12, isActive: false },
      { emoji: "🔥", label: "fire", count: 8, isActive: false },
      { emoji: "😂", label: "laugh", count: 3, isActive: false },
      { emoji: "😮", label: "surprise", count: 1, isActive: false },
    ],
    comments: [
      { id: "c1", author: { name: "Алексей", avatar: "" }, date: subMinutes(now, 90), text: "Отличные новости! Давно ждал это обновление." },
      { id: "c2", author: { name: "Мария", avatar: "" }, date: subMinutes(now, 60), text: "Интерфейс действительно стал лучше 👏" },
      { id: "c3", author: { name: "Дмитрий", avatar: "" }, date: subMinutes(now, 30), text: "А когда будет мобильное приложение?" },
      { id: "c4", author: { name: "Елена", avatar: "" }, date: subMinutes(now, 15), text: "Скорость загрузки реально впечатляет!" },
    ],
  },
  {
    id: "2",
    author: { name: "Светлана Козлова", avatar: "" },
    date: subHours(now, 5),
    text: "**Тренды UI/UX 2026** 🎨\n\nСобрали главные тренды этого года:\n\n1. Нейроморфизм 2.0\n2. Адаптивная типографика\n3. Микро-анимации с физикой\n4. AI-генерация интерфейсов\n\nЧто думаете, какой тренд самый перспективный?",
    images: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    ],
    reactions: [
      { emoji: "👍", label: "like", count: 45, isActive: false },
      { emoji: "❤️", label: "heart", count: 18, isActive: false },
      { emoji: "🔥", label: "fire", count: 22, isActive: false },
      { emoji: "😂", label: "laugh", count: 0, isActive: false },
    ],
    comments: [
      { id: "c5", author: { name: "Игорь", avatar: "" }, date: subHours(now, 4), text: "Микро-анимации — однозначно! Они добавляют жизни интерфейсу." },
      { id: "c6", author: { name: "Ольга", avatar: "" }, date: subHours(now, 3), text: "AI-генерация пока сырая, но потенциал огромный." },
    ],
  },
  {
    id: "3",
    author: { name: "Виктор Сидоров", avatar: "" },
    date: subDays(now, 1),
    text: "🍕 Рецепт идеальной пиццы дома!\n\nТесто:\n• 500г муки\n• 325мл воды\n• 10г дрожжей\n• Щепотка соли\n\nСекрет — дать тесту подойти **минимум 24 часа** в холодильнике. Результат вас удивит!",
    images: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
    ],
    reactions: [
      { emoji: "👍", label: "like", count: 67, isActive: false },
      { emoji: "❤️", label: "heart", count: 34, isActive: false },
      { emoji: "🔥", label: "fire", count: 15, isActive: false },
      { emoji: "😮", label: "surprise", count: 5, isActive: false },
    ],
    comments: [
      { id: "c7", author: { name: "Наташа", avatar: "" }, date: subHours(now, 20), text: "Попробовала — получилось божественно!" },
    ],
  },
];

function formatDateSeparator(date: Date): string {
  if (isToday(date)) return "Сегодня";
  if (isYesterday(date)) return "Вчера";
  return format(date, "d MMMM yyyy", { locale: ru });
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  // Group posts by date
  const grouped: { label: string; posts: Post[] }[] = [];
  posts.forEach((post) => {
    const label = formatDateSeparator(post.date);
    const last = grouped[grouped.length - 1];
    if (last && last.label === label) {
      last.posts.push(post);
    } else {
      grouped.push({ label, posts: [post] });
    }
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="space-y-4">
        {grouped.map((group) => (
          <div key={group.label} className="space-y-4">
            <div className="flex justify-center">
              <span className="text-xs text-muted-foreground bg-muted/60 px-3 py-1 rounded-full">
                {group.label}
              </span>
            </div>
            {group.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
