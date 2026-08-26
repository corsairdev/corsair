import { DocusignClient } from '../client';

export interface CreateEnvelopeParams {
    templateId?: string;
    emailSubject: string;
    status: 'sent' | 'created';
    templateRoles?: Array<{
        email: string;
        name: string;
        roleName: string;
    }>;
    documents?: Array<{
        documentId: string;
        name: string;
        fileExtension?: string;
        documentBase64?: string;
    }>;
    recipients?: {
        signers?: Array<{
            email: string;
            name: string;
            recipientId: string;
            routingOrder?: string;
        }>;
    };
}

export const createEnvelope = async (client: DocusignClient, params: CreateEnvelopeParams) => {
    return client.request('/envelopes', {
        method: 'POST',
        body: JSON.stringify(params),
    });
};

export const getEnvelope = async (client: DocusignClient, { envelopeId }: { envelopeId: string }) => {
    return client.request(`/envelopes/${envelopeId}`);
};

export const sendEnvelope = async (client: DocusignClient, { envelopeId }: { envelopeId: string }) => {
    return client.request(`/envelopes/${envelopeId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'sent' }),
    });
};

export const createRecipientViewUrl = async (
    client: DocusignClient,
    {
        envelopeId,
        ...params
    }: {
        envelopeId: string;
        userName: string;
        email: string;
        returnUrl: string;
        authenticationMethod?: string;
        recipientId?: string;
    }
) => {
    return client.request(`/envelopes/${envelopeId}/views/recipient`, {
        method: 'POST',
        body: JSON.stringify({
            authenticationMethod: 'none',
            recipientId: '1',
            ...params,
        }),
    });
};