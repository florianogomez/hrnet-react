import React from 'react';
import Loader from './Loader';

export interface AppConfirmationModalProps {
  isOpen?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  title: string;
  content: string | React.ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  processing?: boolean;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
  confirmProcessingLabel?: string;
}

export const AppConfirmationModal: React.FC<AppConfirmationModalProps> = ({
  isOpen = false,
  onConfirm,
  onCancel,
  title,
  content,
  cancelLabel = "Annuler",
  confirmLabel = "Confirmer",
  processing = false,
  confirmButtonColor = "primary",
  cancelButtonColor = "secondary",
  confirmProcessingLabel
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        style={{ zIndex: 1040 }}
        onClick={!processing ? onCancel : undefined}
      />
      
      {/* Modal */}
      <div 
        className="modal fade show d-block" 
        style={{ zIndex: 1050 }}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="confirmationModalTitle"
        aria-hidden="false"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title" id="confirmationModalTitle">
                {title}
              </h5>
              {!processing && (
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={onCancel}
                />
              )}
            </div>
            
            {/* Body */}
            <div className="modal-body">
              {content}
            </div>
            
            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className={`btn btn-outline-${cancelButtonColor} btn-sm`}
                onClick={processing ? undefined : onCancel}
                disabled={processing}
                tabIndex={processing ? -1 : 0}
              >
                {cancelLabel}
              </button>

              <button
                type="button"
                className={`btn btn-${processing ? `outline-${confirmButtonColor}` : confirmButtonColor} btn-sm`}
                onClick={processing ? undefined : onConfirm}
                disabled={processing}
                tabIndex={processing ? -1 : 0}
              >
                {processing ? (
                  <>
                    <Loader />
                    <span className="ms-2">{confirmProcessingLabel || "Chargement..."}</span>
                  </>
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
