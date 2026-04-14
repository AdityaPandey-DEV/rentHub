import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export async function POST(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Authenticate the user before allowing them to upload
        const user = await getAuthUser(request);
        if (!user || !['landlord', 'admin'].includes(user.role)) {
          throw new Error('Unauthorized upload request');
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          tokenPayload: JSON.stringify({
            userId: user._id,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This is called on the server after the upload is complete
        console.log('Blob upload completed:', blob, tokenPayload);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error).message },
      { status: 400 },
    );
  }
}
