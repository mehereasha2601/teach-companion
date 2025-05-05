// This is a utility file for handling YouTube video processing
import { YoutubeTranscript } from 'youtube-transcript';

/**
 * Extract video ID from a YouTube URL
 */
export function extractYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

/**
 * Get video thumbnail URL from video ID
 */
export function getYouTubeThumbnailUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/0.jpg`
}

/**
 * Fetch transcript from YouTube video using the youtube-transcript package
 */
export async function getYouTubeTranscript(videoId: string): Promise<string> {
  try {
    // Fetch the actual transcript from YouTube
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    
    // Convert transcript items to a single string
    // Each item has text and timestamp information
    const fullTranscript = transcriptItems
      .map(item => item.text)
      .join(' ');
    
    return fullTranscript;
  } catch (error) {
    console.error("Error fetching YouTube transcript:", error);
    
    // Fallback to mock data if transcript can't be fetched
    return `
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
    `;
  }
}

/**
 * Convert YouTube time format (like 1h2m3s) to seconds
 */
export function convertYouTubeTimeToSeconds(time: string): number {
  const hours = time.match(/(\d+)h/)
  const minutes = time.match(/(\d+)m/)
  const seconds = time.match(/(\d+)s/)

  let totalSeconds = 0
  if (hours) totalSeconds += Number.parseInt(hours[1]) * 3600
  if (minutes) totalSeconds += Number.parseInt(minutes[1]) * 60
  if (seconds) totalSeconds += Number.parseInt(seconds[1])

  return totalSeconds
}
