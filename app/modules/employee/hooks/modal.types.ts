/**
 * State interface for the confirmation modal used in employee actions.
 */
export interface ConfirmModalState {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Modal title */
  title: string;
  /** Modal content/message */
  content: string;
  /** Label for the confirm button */
  confirmLabel: string;
  /** Label for the cancel button */
  cancelLabel: string;
  /** Color for the confirm button */
  confirmButtonColor: string;
  /** Color for the cancel button */
  cancelButtonColor: string;
  /** Function called when confirm is clicked */
  onConfirm: () => void;
  /** Function called when cancel is clicked */
  onCancel: () => void;
  /** Label shown while processing confirmation (optional) */
  confirmProcessingLabel?: string;
}
