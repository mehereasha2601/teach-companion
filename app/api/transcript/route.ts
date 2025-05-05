import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(request: Request) {
  try {
    const { videoId } = await request.json();
    
    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Fetch transcript using the youtube-transcript package
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    
    // Convert transcript items to a single string
    const fullTranscript = transcriptItems
      .map(item => item.text)
      .join(' ');
    
    return NextResponse.json({
      success: true,
      transcript: fullTranscript,
      segments: transcriptItems
    });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch transcript' 
      },
      { status: 500 }
    );
  }
}
