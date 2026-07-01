import { InteractionHookEvent } from '@riven/schemas';

describe('webhook event visibility', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('always includes the adaptive MFA hook event', async () => {
    const { interactionHookEvents } = await import('./webhooks');

    expect(interactionHookEvents).toContain(InteractionHookEvent.PostSignInAdaptiveMfaTriggered);
  });
});
