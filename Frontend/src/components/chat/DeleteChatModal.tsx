import Modal from './Modal';
import Button from './Button';

interface DeleteChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteChatModal({ isOpen, onClose, onConfirm }: DeleteChatModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Delete chat</h2>
        <p className="text-muted-foreground mb-6">
          Are you sure you want to delete this chat? This cannot be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="destructive">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
