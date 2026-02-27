

## Кнопка "Прокомментировать" / "X комментариев" внизу поста

### Что будет сделано

Убрать иконку комментария из строки реакций. Вместо неё внизу каждого поста (на всю ширину, под реакциями) добавить кнопку:
- Если комментариев 0: **"Прокомментировать"**
- Если есть комментарии: **"X комментариев"** / **"X комментарий"** / **"X комментария"** с правильным склонением

Клик по кнопке открывает/закрывает секцию комментариев (как сейчас).

### Склонение

Функция `pluralizeComments(n)`:
- 1, 21, 31... -> "комментарий"
- 2-4, 22-24... -> "комментария"  
- 5-20, 25-30... -> "комментариев"

### Технические детали

**Файл: `src/components/PostCard.tsx`**

1. Добавить функцию `pluralizeComments(count: number): string`
2. Убрать кнопку с `MessageCircle` из блока реакций (строки 180-186)
3. После блока реакций, добавить новую кнопку на всю ширину:

```tsx
<button
  onClick={() => setCommentsOpen((v) => !v)}
  className="w-full text-center py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-t border-border"
>
  {post.comments.length === 0
    ? "Прокомментировать"
    : `${post.comments.length} ${pluralizeComments(post.comments.length)}`}
</button>
```

