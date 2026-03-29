
## План: Раздельная загрузка изображений для мобильной и ПК версий баннеров

### Что нужно сделать
Каждый баннер (и в одиночном блоке, и в слайдере) должен иметь два отдельных изображения: одно для мобильной версии, другое для десктопной. В админке — два поля загрузки. На фронте — показ нужного изображения в зависимости от ширины экрана.

### Изменения

**1. Обновить типы — `src/hooks/useStorefrontBlocks.ts`**
- В интерфейс `BannerItem` добавить поле `mobileImageUrl: string` (существующий `imageUrl` становится десктопным).

**2. Обновить создание блоков — `src/hooks/useStorefrontBlocks.ts`**
- При создании banner/slider добавлять `mobileImageUrl: ""` в каждый элемент banners.

**3. Обновить админку — `src/pages/Admin.tsx` (BannerEditor)**
- Вместо одного поля загрузки «Изображение» — два: «Мобильная версия» и «ПК версия».
- Каждое поле с отдельным upload/preview/delete.
- Обновить `handleBannerImageUpload` для поддержки указания целевого поля (`imageUrl` или `mobileImageUrl`).

**4. Обновить рендер — `src/components/storefront/BannerBlock.tsx`**
- В `renderBanner` использовать `useIsMobile()` хук для выбора между `mobileImageUrl` и `imageUrl`.
- Если мобильное изображение не загружено — фолбэк на десктопное (и наоборот).

### Технические детали
- `BannerItem`: `{ id, imageUrl, mobileImageUrl, link }`
- Хук `useIsMobile` уже есть с breakpoint 1024px
- Фолбэк: `const src = isMobile ? (banner.mobileImageUrl || banner.imageUrl) : (banner.imageUrl || banner.mobileImageUrl)`
