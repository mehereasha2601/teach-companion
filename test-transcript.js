// Simple test script for YouTube transcript functionality
const { YoutubeTranscript } = require('youtube-transcript');

// Test with the provided video URL
const videoUrl = 'https://www.youtube.com/watch?v=opu2Od66TZc';

// Extract video ID from URL
function extractVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

const videoId = extractVideoId(videoUrl);
console.log('Testing transcript extraction for video ID:', videoId);

// Fetch and display transcript
async function testTranscript() {
  try {
    console.log('Fetching transcript...');
    const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
    
    console.log('Transcript items found:', transcriptItems.length);
    
    // Display first few items
    console.log('First 3 transcript segments:');
    transcriptItems.slice(0, 3).forEach((item, index) => {
      console.log(`[${index}] ${item.text} (${item.start}s - ${item.start + item.duration}s)`);
    });
    
    // Display full transcript
    const fullTranscript = transcriptItems.map(item => item.text).join(' ');
    console.log('\nFull transcript (first 500 chars):');
    console.log(fullTranscript.substring(0, 500) + '...');
    
    return { success: true, transcript: fullTranscript };
  } catch (error) {
    console.error('Error fetching transcript:', error.message);
    return { success: false, error: error.message };
  }
}

// Run the test
testTranscript()
  .then(result => {
    console.log('\nTest result:', result.success ? 'SUCCESS' : 'FAILED');
    if (!result.success) {
      console.error('Error:', result.error);
    }
  });
