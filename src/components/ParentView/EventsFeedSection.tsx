import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { uploadSchoolPhoto } from '../../api/syncApi';
import { Camera, Heart, Share2, Sparkles, MessageCircle, PlusCircle, Send, Upload, X } from 'lucide-react';

export const EventsFeedSection: React.FC<{ allowPublish?: boolean }> = ({ allowPublish = false }) => {
  const { role, posts, togglePostLike, addPost, addPostComment, addNotification } = useApp();
  const [filter, setFilter] = useState<'all' | 'events' | 'workshops' | 'life'>('all');
  const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Composer state for Teacher/Admin
  const canPublish = allowPublish || role === 'curator' || role === 'extended_teacher' || role === 'admin';
  const [showComposer, setShowComposer] = useState(false);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [category, setCategory] = useState<'life' | 'workshops' | 'events'>('life');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredPosts = posts.filter((p) => filter === 'all' || p.category === filter);

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'workshops':
        return { label: 'Мастерские', color: 'bg-amber-100 text-amber-800' };
      case 'events':
        return { label: 'Мероприятия', color: 'bg-purple-100 text-[#4e1984]' };
      default:
        return { label: 'Жизнь школы', color: 'bg-emerald-100 text-emerald-800' };
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    for (const file of Array.from(files)) {
      const uploadedUrl = await uploadSchoolPhoto(file);
      if (uploadedUrl) {
        setUploadedImages((prev) => [...prev, uploadedUrl]);
      } else {
        // Local data URL fallback if offline
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setUploadedImages((prev) => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
    setIsUploading(false);
    e.target.value = '';
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;
    addPost({
      author: role === 'admin' ? 'Дирекция школы «Грани»' : 'Ольга Васильевна',
      authorRole: role === 'admin' ? 'Администратор центра' : 'Классный руководитель 1 «А»',
      title: title.trim(),
      text: text.trim(),
      category,
      images: uploadedImages
    });
    setTitle('');
    setText('');
    setUploadedImages([]);
    setShowComposer(false);
  };

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    addPostComment(postId, commentInput.trim());
    setCommentInput('');
  };

  return (
    <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#e8e6d9] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#4e1984] flex items-center justify-center font-bold">
            <Camera className="w-5 h-5 text-[#4e1984]" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-[#2d124d]">Лента школьных событий</h2>
            <p className="text-[11px] text-[#6d647a]">Фотоотчеты и яркие моменты из жизни центра</p>
          </div>
        </div>

        {canPublish ? (
          <button
            onClick={() => setShowComposer(!showComposer)}
            className="text-xs font-bold bg-[#4e1984] text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1 hover:bg-[#3b1266] transition shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Фотоотчет</span>
          </button>
        ) : (
          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Сегодня
          </span>
        )}
      </div>

      {/* Staff Post Composer */}
      {canPublish && showComposer && (
        <form
          onSubmit={handlePublish}
          className="bg-[#fbfbf6] border-2 border-[#4e1984] rounded-2xl p-3.5 space-y-2.5 text-xs"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#4e1984]">Новый фотоотчет для родителей</span>
            <button type="button" onClick={() => setShowComposer(false)} className="text-gray-400 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-1.5">
            {[
              { id: 'life', label: 'Жизнь школы' },
              { id: 'workshops', label: 'Мастерские' },
              { id: 'events', label: 'Мероприятия' }
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id as 'life' | 'workshops' | 'events')}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] ${
                  category === c.id ? 'bg-[#4e1984] text-white' : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Заголовок (например: Занятие в гончарной мастерской)"
            className="w-full p-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#4e1984]"
          />

          <textarea
            rows={2}
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Короткий рассказ о том, что делали ребята..."
            className="w-full p-2 rounded-xl border border-gray-300 bg-white focus:outline-none focus:border-[#4e1984]"
          />

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full py-2 border border-dashed border-[#4e1984] rounded-xl text-[#4e1984] font-bold bg-purple-50/50 hover:bg-purple-50 flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isUploading ? 'Загрузка фото...' : 'Выбрать фото с телефона / компьютера'}</span>
            </button>

            {uploadedImages.length > 0 && (
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {uploadedImages.map((img, i) => (
                  <div key={i} className="relative shrink-0">
                    <img src={img} alt="preview" className="w-16 h-16 rounded-lg object-cover border" />
                    <button
                      type="button"
                      onClick={() => setUploadedImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#4e1984] hover:bg-[#3b1266] text-white py-2 rounded-xl font-bold transition"
          >
            Опубликовать фотоотчет
          </button>
        </form>
      )}

      {/* Filter pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'all', label: 'Все события' },
          { id: 'life', label: 'Жизнь школы' },
          { id: 'workshops', label: 'Мастерские' },
          { id: 'events', label: 'Мероприятия' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as 'all' | 'life' | 'workshops' | 'events')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
              filter === f.id
                ? 'bg-[#4e1984] text-[#f7f8ea] shadow-sm'
                : 'bg-[#f7f8ea] text-[#563b76] hover:bg-[#eceecc] border border-[#eceecc]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const cat = getCategoryBadge(post.category);
          const comments = post.comments || [];
          const isCommentsOpen = openCommentsId === post.id;
          return (
            <article
              key={post.id}
              className="rounded-2xl border border-[#eceecc] bg-[#fbfbf6] overflow-hidden shadow-xs"
            >
              {/* Author bar */}
              <div className="p-3 pb-2 flex items-center justify-between">
                <div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${cat.color}`}>
                    {cat.label}
                  </span>
                  <div className="font-bold text-xs text-[#2d124d] mt-1">{post.author}</div>
                  <div className="text-[10px] text-[#8e859b]">{post.authorRole} • {post.time}</div>
                </div>
              </div>

              {/* Title and Text */}
              <div className="px-3 pb-2.5">
                <h3 className="font-bold text-sm text-[#2d124d] leading-snug">{post.title}</h3>
                <p className="text-xs text-[#563b76] mt-1 leading-relaxed">{post.text}</p>
              </div>

              {/* Images */}
              {post.images && post.images.length > 0 && (
                <div
                  className={`grid gap-1 px-3 pb-3 ${
                    post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
                  }`}
                >
                  {post.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={post.title}
                      className="w-full h-44 object-cover rounded-xl shadow-xs"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}

              {/* Interaction Bar */}
              <div className="px-3 py-2 bg-white border-t border-[#f0eee0] flex items-center justify-between text-xs">
                <button
                  onClick={() => togglePostLike(post.id)}
                  className={`flex items-center gap-1.5 font-bold transition px-2.5 py-1 rounded-lg ${
                    post.isLiked
                      ? 'text-rose-600 bg-rose-50'
                      : 'text-[#6d647a] hover:bg-gray-100'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                  <span>{post.likes}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setOpenCommentsId(isCommentsOpen ? null : post.id)}
                    className={`px-2 py-1 rounded-lg transition flex items-center gap-1 text-xs ${
                      isCommentsOpen ? 'bg-purple-100 text-[#4e1984] font-bold' : 'text-[#6d647a] hover:bg-gray-100'
                    }`}
                    title="Комментарии"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {comments.length > 0 && <span>{comments.length}</span>}
                  </button>
                  <button
                    onClick={() => addNotification('Ссылка на фотоотчет скопирована')}
                    className="p-1.5 text-[#6d647a] hover:text-[#4e1984] hover:bg-gray-100 rounded-lg transition"
                    title="Поделиться"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Comments Drawer */}
              {isCommentsOpen && (
                <div className="p-3 bg-white border-t border-[#f0eee0] space-y-2 text-xs">
                  {comments.length === 0 ? (
                    <div className="text-[11px] text-gray-400">Пока нет комментариев. Напишите первый!</div>
                  ) : (
                    <div className="space-y-1.5">
                      {comments.map((c) => (
                        <div key={c.id} className="bg-[#f7f8ea] p-2 rounded-xl border border-[#eceecc]">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-bold text-[#4e1984]">{c.author}</span>
                            <span className="text-gray-400">{c.time}</span>
                          </div>
                          <div className="text-[11px] text-[#2d124d] mt-0.5">{c.text}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                      placeholder="Написать комментарий..."
                      className="flex-1 px-2.5 py-1.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#4e1984]"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      className="bg-[#4e1984] text-white p-2 rounded-xl hover:bg-[#3b1266]"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};
