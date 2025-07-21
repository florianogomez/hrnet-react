import { AlertVariantEnum } from "~/enums/AlertVariantEnum";

/**
 * The props for the Alert component.
 * @interface AlertProps
 * @property {AlertVariantEnum} [variant=AlertVariantEnum.PRIMARY] - The color variant of the alert.
 * @property {React.ReactNode} children - The content of the alert.
 * @property {boolean} [dismissible=false] - Whether the alert can be dismissed.
 * @property {() => void} [onDismiss] - Function called when the alert is dismissed.
 */
export interface AlertProps {
	variant?: AlertVariantEnum;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

/**
 * Alert component for displaying visual messages with different variants.
 * It can be dismissed if the `dismissible` option is enabled.
 * @param {AlertProps} props - Component props.
 * @param {AlertVariantEnum} [props.variant=AlertVariantEnum.PRIMARY] - The color variant of the alert.
 * @param {React.ReactNode} props.children - The content of the alert.
 * @param {boolean} [props.dismissible=false] - Whether the alert can be dismissed.
 * @param {() => void} [props.onDismiss] - Function called when the alert is dismissed.
 * @example
 * ```tsx
 * <Alert variant={AlertVariantEnum.SUCCESS} dismissible onDismiss={() => console.log('Alert closed')}>
 *   Operation successful!
 * </Alert>
 * ```
 * @returns A JSX element representing the alert.
 */
export default function Alert({ 
  variant = AlertVariantEnum.PRIMARY, 
  children,
  dismissible = false,
  onDismiss 
}: AlertProps) {
	return (
		<div className={`alert alert-${variant} ${dismissible ? 'alert--dismissible' : ''}`}>
			{children}
      {dismissible && (
        <button 
          type="button" 
          className="alert__close-btn" 
          aria-label="Close"
          onClick={onDismiss}
        >
          &times;
        </button>
      )}
		</div>
	);
}
