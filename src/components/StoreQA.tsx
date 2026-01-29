import { useState } from "react";
import { MessageCircle, ThumbsUp, Send, ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Answer {
  id: string;
  userName: string;
  text: string;
  date: string;
  likes: number;
  isLiked?: boolean;
  isSeller?: boolean;
}

interface Question {
  id: string;
  userName: string;
  text: string;
  date: string;
  answers: Answer[];
  isOpen?: boolean;
}

// Mock data
const mockQuestions: Question[] = [
  {
    id: "1",
    userName: "Ирина М.",
    text: "Подскажите, пожалуйста, соответствуют ли размеры таблице? Или лучше брать на размер больше?",
    date: "18 января 2025",
    answers: [
      {
        id: "a1",
        userName: "Организатор",
        text: "Здравствуйте! Размеры соответствуют стандартной таблице размеров. Если сомневаетесь, рекомендуем измерить свои параметры и сверить с таблицей в описании товара.",
        date: "18 января 2025",
        likes: 12,
        isLiked: false,
        isSeller: true,
      },
      {
        id: "a2",
        userName: "Елена К.",
        text: "Я брала по своему размеру — село идеально. Не маломерит.",
        date: "19 января 2025",
        likes: 5,
        isLiked: false,
      },
    ],
  },
  {
    id: "2",
    userName: "Алексей В.",
    text: "Когда будет следующая закупка? Хочу заказать несколько позиций, но сейчас не успеваю.",
    date: "15 января 2025",
    answers: [
      {
        id: "a3",
        userName: "Организатор",
        text: "Следующая закупка планируется в начале февраля. Подпишитесь на магазин, чтобы не пропустить открытие!",
        date: "15 января 2025",
        likes: 8,
        isLiked: true,
        isSeller: true,
      },
    ],
  },
  {
    id: "3",
    userName: "Марина С.",
    text: "Есть ли возможность заказать товар в другом цвете? В каталоге только белый.",
    date: "12 января 2025",
    answers: [],
  },
];

const AnswerCard = ({ answer, onLike }: { answer: Answer; onLike: (id: string) => void }) => (
  <div className="ml-8 mt-3 p-3 bg-secondary/30 rounded-lg border-l-2 border-primary/30">
    <div className="flex items-center gap-2 mb-2">
      <Avatar className="h-6 w-6">
        <AvatarFallback className={cn(
          "text-xs",
          answer.isSeller ? "bg-primary text-primary-foreground" : "bg-muted"
        )}>
          {answer.userName.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-foreground">{answer.userName}</span>
      {answer.isSeller && (
        <Badge variant="secondary" className="text-xs">Организатор</Badge>
      )}
      <span className="text-xs text-muted-foreground">{answer.date}</span>
    </div>
    <p className="text-sm text-foreground mb-2">{answer.text}</p>
    <button
      onClick={() => onLike(answer.id)}
      className={cn(
        "flex items-center gap-1 text-xs transition-colors",
        answer.isLiked ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <ThumbsUp className={cn("h-3 w-3", answer.isLiked && "fill-current")} />
      <span>{answer.likes}</span>
    </button>
  </div>
);

const QuestionCard = ({
  question,
  onToggle,
  onLikeAnswer,
  onAnswer,
}: {
  question: Question;
  onToggle: (id: string) => void;
  onLikeAnswer: (answerId: string) => void;
  onAnswer: (questionId: string, text: string) => void;
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onAnswer(question.id, replyText);
      setReplyText("");
      setIsReplying(false);
    }
  };

  return (
    <div className="border-b border-border py-4 last:border-0">
      {/* Question */}
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {question.userName.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-foreground">{question.userName}</span>
            <span className="text-xs text-muted-foreground">{question.date}</span>
          </div>
          <p className="text-sm text-foreground">{question.text}</p>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => onToggle(question.id)}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <MessageCircle className="h-4 w-4" />
              <span>
                {question.answers.length > 0
                  ? `${question.answers.length} ответ${question.answers.length === 1 ? "" : question.answers.length < 5 ? "а" : "ов"}`
                  : "Ответить"}
              </span>
            </button>
            {!isReplying && (
              <button
                onClick={() => setIsReplying(true)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Написать ответ
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Answers */}
      {question.isOpen && question.answers.length > 0 && (
        <div className="mt-2">
          {question.answers.map((answer) => (
            <AnswerCard key={answer.id} answer={answer} onLike={onLikeAnswer} />
          ))}
        </div>
      )}

      {/* Reply Form */}
      {isReplying && (
        <div className="ml-8 mt-3 space-y-2">
          <Textarea
            placeholder="Напишите ваш ответ..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSubmitReply} disabled={!replyText.trim()}>
              <Send className="h-4 w-4 mr-1" />
              Отправить
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsReplying(false)}>
              Отмена
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const StoreQA = () => {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");

  const handleToggleQuestion = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, isOpen: !q.isOpen } : q
      )
    );
  };

  const handleLikeAnswer = (answerId: string) => {
    setQuestions((prev) =>
      prev.map((q) => ({
        ...q,
        answers: q.answers.map((a) =>
          a.id === answerId
            ? { ...a, isLiked: !a.isLiked, likes: a.isLiked ? a.likes - 1 : a.likes + 1 }
            : a
        ),
      }))
    );
  };

  const handleAnswer = (questionId: string, text: string) => {
    const newAnswer: Answer = {
      id: `a${Date.now()}`,
      userName: "Вы",
      text,
      date: "Только что",
      likes: 0,
      isLiked: false,
    };
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, answers: [...q.answers, newAnswer], isOpen: true }
          : q
      )
    );
  };

  const handleAskQuestion = () => {
    if (newQuestion.trim()) {
      const question: Question = {
        id: `q${Date.now()}`,
        userName: "Вы",
        text: newQuestion,
        date: "Только что",
        answers: [],
        isOpen: false,
      };
      setQuestions((prev) => [question, ...prev]);
      setNewQuestion("");
      setIsAskingQuestion(false);
    }
  };

  return (
    <div className="bg-card rounded-lg p-4 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg lg:text-xl font-bold text-foreground">
          Вопросы и ответы
        </h2>
        <Button
          variant={isAskingQuestion ? "outline" : "default"}
          size="sm"
          onClick={() => setIsAskingQuestion(!isAskingQuestion)}
        >
          {isAskingQuestion ? "Отмена" : "Задать вопрос"}
        </Button>
      </div>

      {/* Ask Question Form */}
      {isAskingQuestion && (
        <div className="mb-4 p-4 bg-secondary/30 rounded-lg space-y-3">
          <Textarea
            placeholder="Задайте ваш вопрос организатору или другим покупателям..."
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleAskQuestion} disabled={!newQuestion.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Отправить вопрос
          </Button>
        </div>
      )}

      {/* Questions List */}
      <div>
        {questions.length > 0 ? (
          questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onToggle={handleToggleQuestion}
              onLikeAnswer={handleLikeAnswer}
              onAnswer={handleAnswer}
            />
          ))
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Вопросов пока нет. Будьте первым!
          </div>
        )}
      </div>

      {/* Load More */}
      {questions.length > 0 && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" className="gap-2">
            <ChevronDown className="h-4 w-4" />
            Показать ещё вопросы
          </Button>
        </div>
      )}
    </div>
  );
};
