import request from 'supertest';
import express from 'express';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import nock from 'nock';
import ttsRoute from '../routes/tts.js';

const app = express();
app.use(express.json());
app.use('/api/tts', ttsRoute);

describe('POST /api/tts', () => {
  beforeEach(() => {
    process.env.GOOGLE_TTS_API_KEY = 'test-key';
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('should return 400 if text is missing', async () => {
    const res = await request(app)
      .post('/api/tts')
      .send({ languageCode: 'en-IN' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('missing_params');
  });

  it('should return 500 if API key is missing', async () => {
    delete process.env.GOOGLE_TTS_API_KEY;
    delete process.env.GOOGLE_TRANSLATE_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const res = await request(app)
      .post('/api/tts')
      .send({ text: 'Hello' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('config_error');
  });

  it('should successfully synthesize speech and return an MP3 buffer', async () => {
    const mockAudioContent = Buffer.from('mock-audio-data').toString('base64');
    
    // Intercept the HTTP request
    nock('https://texttospeech.googleapis.com')
      .post('/v1/text:synthesize')
      .query({ key: 'test-key' })
      .reply(200, {
        audioContent: mockAudioContent
      });

    const res = await request(app)
      .post('/api/tts')
      .send({ text: 'Hello World', languageCode: 'en-IN' });

    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toBe('audio/mpeg');
    expect(res.body instanceof Buffer).toBe(true);
  });

  it('should return 500 if Google TTS API fails', async () => {
    nock('https://texttospeech.googleapis.com')
      .post('/v1/text:synthesize')
      .query({ key: 'test-key' })
      .replyWithError('API Error');

    const res = await request(app)
      .post('/api/tts')
      .send({ text: 'Hello' });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe('tts_error');
  });
});
