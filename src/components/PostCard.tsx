import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { Send, MessageCircle } from "lucide-react";

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
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary/80"
        >
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

const VISIBLE_COMMENTS = 2;

export function PostCard({ post: initialPost }: { post: Post }) {
  const [post, setPost] = useState(initialPost);
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

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

  const addComment = () => {
    const text = newComment.trim();
    if (!text) return;
    const comment: PostComment = {
      id: crypto.randomUUID(),
      author: { name: "Вы", avatar: "" },
      date: new Date(),
      text,
    };
    setPost((prev) => ({ ...prev, comments: [...prev.comments, comment] }));
    setNewComment("");
    setCommentsOpen(true);
    setShowAllComments(true);
  };

  const visibleComments = showAllComments
    ? post.comments
    : post.comments.slice(0, VISIBLE_COMMENTS);
  const hasMoreComments = post.comments.length > VISIBLE_COMMENTS;

  return (
    <article className="bg-card rounded-lg shadow-sm border border-border">
      {/* Header */}
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

      {/* Text */}
      <div className="px-4 pb-2 text-sm text-foreground whitespace-pre-line leading-relaxed">
        {formatPostText(post.text)}
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="px-4">
          <ImageGallery images={post.images} />
        </div>
      )}

      {/* Reactions */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-2 flex-wrap">
        {post.reactions.map((r, i) => (
          <button
            key={r.label}
            onClick={() => toggleReaction(i)}
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

        <button
          onClick={() => setCommentsOpen((v) => !v)}
          className="ml-auto inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments.length}</span>
        </button>
      </div>

      {/* Comments */}
      {commentsOpen && (
        <div className="border-t border-border px-4 pt-3 pb-4 space-y-3">
          {post.comments.length > 0 && (
            <p className="text-xs font-medium text-muted-foreground">
              Комментарии ({post.comments.length})
            </p>
          )}

          {visibleComments.map((c) => (
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
              </div>
            </div>
          ))}

          {hasMoreComments && !showAllComments && (
            <button
              onClick={() => setShowAllComments(true)}
              className="text-sm text-primary hover:underline"
            >
              Показать ещё ({post.comments.length - VISIBLE_COMMENTS})
            </button>
          )}
          {hasMoreComments && showAllComments && (
            <button
              onClick={() => setShowAllComments(false)}
              className="text-sm text-primary hover:underline"
            >
              Скрыть
            </button>
          )}

          {/* New comment form */}
          <div className="flex gap-2 pt-1">
            <Input
              placeholder="Написать комментарий..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
              className="flex-1 h-9 text-sm"
            />
            <Button size="icon" variant="ghost" onClick={addComment} disabled={!newComment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}
