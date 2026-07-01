import { type ConnectorResponse } from '@riven/schemas';

import UnnamedTrans from '../UnnamedTrans';

function ConnectorName({ name }: { readonly name: ConnectorResponse['name'] | string }) {
  return typeof name === 'string' ? <span>{name}</span> : <UnnamedTrans resource={name} />;
}

export default ConnectorName;
