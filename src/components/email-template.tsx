import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  businessName: string;
  inviteLink: string;
  invitedBy: string;
}

export function EmailTemplate({
  name,
  businessName,
  inviteLink,
  invitedBy,
}: EmailTemplateProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, padding: '24px', color: '#333' }}>
      <h2 style={{ color: '#111' }}>Hello {name},</h2>

      <p>
        <strong>{invitedBy}</strong> has invited you to join <strong>{businessName}</strong> on WorkSphere.
      </p>

      <p>
        Click the button below to accept the invitation and join the team.
      </p>

      <a
        href={inviteLink}
        style={{
          display: 'inline-block',
          marginTop: '16px',
          padding: '12px 20px',
          backgroundColor: '#2563eb',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
        }}
      >
        Accept Invitation
      </a>

      <p style={{ marginTop: '24px' }}>
        If you did not expect this invitation, you can safely ignore this email.
      </p>

      <hr style={{ marginTop: '32px', marginBottom: '16px' }} />

      <p style={{ fontSize: '12px', color: '#777' }}>
        This invitation will expire in 24 hours.
        <br />
        Sent by {businessName} using WorkSphere.
      </p>
    </div>
  );
}
