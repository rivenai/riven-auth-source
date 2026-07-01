import { ConnectorType } from '@riven/connector-kit';
import { SignInIdentifier } from '@riven/schemas';

export const identifierRequiredConnectorMapping: {
  [key in SignInIdentifier]?: ConnectorType;
} = {
  [SignInIdentifier.Email]: ConnectorType.Email,
  [SignInIdentifier.Phone]: ConnectorType.Sms,
};
