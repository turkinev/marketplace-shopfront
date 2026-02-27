import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { Send, ChevronRight, Smile, Paperclip, X } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

function pluralizeComments(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "комментарий";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "комментария";
  return "комментариев";
}

export interface PostAuthor {
  name: string;
  avatar: string;
}

export interface PostReaction {
  emoji: string;
  label: string;
  count: number;
  isActive: boolean;
}

export interface PostComment {
  id: string;
  author: PostAuthor;
  date: Date;
  text: string;
  attachment?: string;
}

const EMOJI_LIST = [
  "😀","😂","🥹","😍","🤔","😎","😢","😮",
  "👍","👎","👏","🙏","🤝","💪","✅","⭐",
  "❤️","🔥","🎉","💯",
];

function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <div className="grid grid-cols-8 gap-1 p-2">
      {EMOJI_LIST.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onSelect(emoji)}
          className="h-8 w-8 flex items-center justify-center rounded hover:bg-muted text-lg transition-colors"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

export interface Post {
  id: string;
  author: PostAuthor;
  date: Date;
  text: string;
  images?: string[];
  reactions: PostReaction[];
  comments: PostComment[];
}

function formatPostText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80">
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function ImageGallery({ images }: { images: string[] }) {
  if (images.length === 1) {
    return (
      <div className="mt-3 rounded-lg overflow-hidden">
        <img src={images[0]} alt="" className="w-full max-h-96 object-cover" />
      </div>
    );
  }
  if (images.length === 2) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
        {images.map((src, i) => (
          <img key={i} src={src} alt="" className="w-full h-48 object-cover" />
        ))}
      </div>
    );
  }
  if (images.length === 3) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
        <img src={images[0]} alt="" className="w-full h-48 object-cover row-span-2" style={{ gridRow: "1 / 3" }} />
        <img src={images[1]} alt="" className="w-full h-[calc(96px-2px)] object-cover" />
        <img src={images[2]} alt="" className="w-full h-[calc(96px-2px)] object-cover" />
      </div>
    );
  }
  return (
    <div className="mt-3 grid grid-cols-2 gap-1 rounded-lg overflow-hidden">
      {images.slice(0, 4).map((src, i) => (
        <img key={i} src={src} alt="" className="w-full h-36 object-cover" />
      ))}
    </div>
  );
}

function PostContent({ post, onToggleReaction }: { post: Post; onToggleReaction: (i: number) => void }) {
  return (
    <>
      <div className="flex items-center gap-3 p-4 pb-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author.avatar} alt={post.author.name} />
          <AvatarFallback>{post.author.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{post.author.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatDistanceToNow(post.date, { addSuffix: true, locale: ru })}
          </p>
        </div>
      </div>
      <div className="px-4 pb-2 text-sm text-foreground whitespace-pre-line leading-relaxed">
        {formatPostText(post.text)}
      </div>
      {post.images && post.images.length > 0 && (
        <div className="px-4">
          <ImageGallery images={post.images} />
        </div>
      )}
      <div className="flex items-center gap-1 px-4 pt-3 pb-2 flex-wrap">
        {post.reactions.map((r, i) => (
          <button
            key={r.label}
            onClick={() => onToggleReaction(i)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm border transition-colors ${
              r.isActive
                ? "bg-primary/10 border-primary text-primary"
                : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted"
            }`}
          >
            <span>{r.emoji}</span>
            {r.count > 0 && <span className="text-xs font-medium">{r.count}</span>}
          </button>
        ))}
      </div>
    </>
  );
}

export function PostCard({ post: initialPost }: { post: Post }) {
  const [post, setPost] = useState(initialPost);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [attachedFile, setAttachedFile] = useState<{ file: File; preview: string } | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const toggleReaction = (index: number) => {
    setPost((prev) => ({
      ...prev,
      reactions: prev.reactions.map((r, i) =>
        i === index
          ? { ...r, isActive: !r.isActive, count: r.isActive ? r.count - 1 : r.count + 1 }
          : r
      ),
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setAttachedFile({ file, preview });
    e.target.value = "";
  };

  const removeFile = () => {
    if (attachedFile) {
      URL.revokeObjectURL(attachedFile.preview);
      setAttachedFile(null);
    }
  };

  const addComment = () => {
    const text = newComment.trim();
    if (!text && !attachedFile) return;
    const comment: PostComment = {
      id: crypto.randomUUID(),
      author: { name: "Вы", avatar: "" },
      date: new Date(),
      text,
      attachment: attachedFile?.preview,
    };
    setPost((prev) => ({ ...prev, comments: [...prev.comments, comment] }));
    setNewComment("");
    removeFile();
  };

  return (
    <>
      <article className="bg-card rounded-lg shadow-sm border border-border">
        <PostContent post={post} onToggleReaction={toggleReaction} />

        <button
          onClick={() => setDialogOpen(true)}
          className="w-full flex items-center justify-center gap-1 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-t border-border"
        >
          <span>
            {post.comments.length === 0
              ? "Прокомментировать"
              : `${post.comments.length} ${pluralizeComments(post.comments.length)}`}
          </span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </article>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-full h-full sm:max-w-2xl sm:h-[90vh] flex flex-col p-0 gap-0 rounded-none sm:rounded-lg">
          <DialogHeader className="p-4 border-b border-border shrink-0">
            <DialogTitle className="text-base font-semibold">Комментарии</DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto flex-1">
            <PostContent post={post} onToggleReaction={toggleReaction} />

            <div className="border-t border-border px-4 pt-3 pb-4">
              {post.comments.length > 0 ? (
                <>
                  <p className="text-xs font-medium text-muted-foreground mb-3">
                    Комментарии ({post.comments.length})
                  </p>
                  <div className="space-y-3">
                    {post.comments.map((c) => (
                      <div key={c.id} className="flex gap-2">
                        <Avatar className="h-7 w-7 mt-0.5">
                          <AvatarImage src={c.author.avatar} alt={c.author.name} />
                          <AvatarFallback className="text-[10px]">{c.author.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xs font-semibold text-foreground">{c.author.name}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {formatDistanceToNow(c.date, { addSuffix: true, locale: ru })}
                            </span>
                          </div>
                          <p className="text-sm text-foreground">{c.text}</p>
                          {c.attachment && (
                            <img src={c.attachment} alt="" className="mt-1 h-24 w-auto rounded object-cover" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">Комментариев пока нет...</p>
              )}
            </div>
          </div>

          {attachedFile && (
            <div className="px-4 pt-2 border-t border-border shrink-0 bg-background">
              <div className="relative inline-block">
                <img src={attachedFile.preview} alt="" className="h-12 w-12 rounded object-cover" />
                <button
                  onClick={removeFile}
                  className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          <div className="p-4 border-t border-border shrink-0 bg-background flex items-center gap-1">
            <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" align="start" className="w-auto p-0">
                <EmojiPicker onSelect={(emoji) => { setNewComment((prev) => prev + emoji); setEmojiOpen(false); }} />
              </PopoverContent>
            </Popover>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => fileInputRef.current?.click()}>
              <Paperclip className="h-4 w-4" />
            </Button>

            <Input
              placeholder="Написать комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
              className="flex-1 h-9 text-sm"
            />
            <Button size="icon" variant="ghost" onClick={addComment} disabled={!newComment.trim() && !attachedFile}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
