import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import Button from '../Button';
import './CommentModal.css';

function CommentModal({ isOpen, onClose, onSubmit, rating }) {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(comment);
    setComment('');
  };

  const handleSkip = () => {
    onSubmit('');
    setComment('');
  };

  const ratingEmoji = {
    'like': '❤️',
    'dislike': '💔',
    'superlike': '⭐'
  };

  const ratingText = {
    'like': 'Подобається',
    'dislike': 'Не подобається',
    'superlike': 'Дуже подобається'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="comment-modal">
        <h3 className="comment-modal-title">
          {ratingEmoji[rating]} {ratingText[rating]}
        </h3>
        <p className="comment-modal-subtitle">
          Хочете додати коментар? (необов'язково)
        </p>
        
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Що вам сподобалось або не сподобалось?"
          rows={4}
          className="comment-textarea"
          autoFocus
        />

        <div className="comment-modal-actions">
          <Button onClick={handleSkip} variant="ghost">
            Пропустити
          </Button>
          <Button onClick={handleSubmit} variant="primary">
            Зберегти
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default CommentModal;
