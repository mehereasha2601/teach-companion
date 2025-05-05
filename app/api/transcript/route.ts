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

    try {
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
    } catch (transcriptError) {
      console.error('Transcript error:', transcriptError);
      
      // Return a mock transcript as fallback with a warning
      return NextResponse.json({
        success: true,
        transcript: `
          Good morning class! Today we're going to be learning about fractions.
          Fractions are a way to represent parts of a whole.
          For example, if I have a pizza and cut it into 8 slices, each slice is 1/8 of the whole pizza.
          Now, who can tell me what the top number in a fraction is called?
          [Student responds]
          That's right, it's called the numerator. And the bottom number?
          [Student responds]
          Correct! It's called the denominator.
          Let's practice with some examples. If I have 3 out of 4 pieces of a chocolate bar, what fraction would that be?
          [Students respond]
          Yes, that would be 3/4. The numerator is 3, and the denominator is 4.
          Now let's talk about equivalent fractions...
        `,
        isMockTranscript: true,
        error: transcriptError instanceof Error ? transcriptError.message : 'Failed to fetch transcript'
      });
    }
  } catch (error) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process request' 
      },
      { status: 500 }
    );
  }
}
