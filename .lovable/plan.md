

## Инверсия цветов хедера (белый фон, голубой текст)

Сейчас десктопный хедер: голубой фон (`bg-primary`), белый текст (`text-primary-foreground`).  
Нужно инвертировать: белый фон, голубой текст/иконки.

### Изменения в `src/components/DesktopHeader.tsx`:

1. **Основной header** (строка ~235): `bg-primary text-primary-foreground` → `bg-white text-primary`
2. **Лого** (~243): `bg-primary-foreground/20` → `bg-primary/10`, текст `text-primary-foreground` → `text-primary`
3. **Кнопка Каталог** (~251): `bg-primary-foreground text-primary` → `bg-primary text-primary-foreground`
4. **Поле поиска** (~265): `bg-primary-foreground` → `bg-muted`, кнопка поиска остаётся `bg-primary`
5. **Иконки действий** (User, Heart, Bell, Cart ~284, 356, 364, 372): `text-primary-foreground hover:bg-primary-foreground/10` → `text-primary hover:bg-primary/10`
6. **Навигационная панель** (~385-404): бордер `border-primary-foreground/10` → `border-primary/10`, ссылки `text-primary-foreground/90 hover:text-primary-foreground hover:bg-primary-foreground/10` → `text-primary/80 hover:text-primary hover:bg-primary/10`
7. **Бейджи уведомлений** — проверить контрастность на белом фоне
8. **Shadow**: `shadow-md` → `shadow-sm` или оставить, добавить нижний бордер `border-b border-border`

