---
id: 17-auto-dubbing
title: "Experimental Modular Voice Dubbing for Shows & Movies"
date: "2026-08-18"
topic: "Project"
excerpt: "Current project on end-to-end high quality automated audio dubbing"
---

The premise for this project is simple - I want my parents to see the shows I've watched. Except, like a majority of the world, English is not their native language, nor do they like having subtitles. So, it has to be dubbing, it has to be high quality enough to be engaging.

For those looking for the same fix, you can find the project here - https://github.com/writer-in-fancy-pants/audio_dubbing
I would love some comments, feedback, feature requests, etc. In a day or a week, I'll also add the support to create audiobooks, which is not trivial when you want a certain level of polish. I went with a fully open-weights setup, because I wanted it to be a learning process, and boy it was. You can skip all that and use this project, or pay for ElevenLabs paid APIs, or you know, what for real people to dub your shows. I am an impatient person, and also cheap. So... this.

## Intuition
The problem can be solved in two ways
- Transcribe the original audio, or use subtitles -> translate the source text into target language -> convert text to speech
- Use a speech to speech translator

### Denoising
Before we do either of those, first thing we do is denoising. Meta may have created a lot of social media addicts but I seriously thank them for their open-source models, specially in audio domain. **Demucs** is basically an industry standard for denoising at this point. Works out of the box, not finnicky, and didn't require and shenanigans for my task. Run it, and you get two tracks - clean vocal speech + background sounds. How wonderful. Without this, any speech synthesis from text was bound to be lackluster since the background sounds are rather important in a cinematic experience.

I'll go over the ideas as well as the tools together. If you want technical coverage, just go see github, or talk to me.

### Extracting, processing audio
The multimedia swiss knife **ffmpeg** got it covered. Extracts audio, subtitles, chops tracks into pieces, stretches for alignment, adjust volume, and more. Life for anyone working with audio had been pretty hard before ffmpeg. A lot of python audio tools still are just ffmpeg and numpy in a trenchcoat. Using ffmpeg as a scalpel, you can open up the video, take out the audio, do your thing, and put back the freshly dubbed audio along with the original, sew the the whole thing back with ffmpeg sutures. You get it.

### Transcription - Translation - TTS (T4S)
Going deeper into the first scenario, we can either transcribe the audio into text ourselves, or use subtitles. Both ways works.

#### Subtitles
Subtitles offer a superior curated language content, specially if you already have the target language subtitles. The language is a better match. Saves a lot of work. However, often for a TV show or a movie, subtitles may not sync very well. The timing is supposed to make them appear on screen in the ballpark of the speaker saying something. That timing may not be good enough for matching the actual audio content. This may be fixable by matching the audio onset to the subtitles text, specially if there's isn't a lot of audio.

#### Transcription
Other option, with more work, and what I spent most time on, was dubbing from the source audio. That requires knowing when the speaker changed, when the voice activity actually happens in the vocal track - speaker diarization. With **silero-vad** and **pyannote**, it was possible to extract these chunks rather nicely. Whatever other open weights models I used for speaker classification, all underperformed or worked at par with these. Good thing this is a non-commercial hobby project, you gotta pay attention to the licenses. **Whisper** covers transcription - another industry standard at this point, though it loves to Hodor to the last word if you let it.

#### Translation
Translation is the most finnicky part. I spent days building the perfect pipeline. Not every translation model works for every language. It has to be customized, well chosen. I could have cheated with bigger better open-weight models, but I didn't. Maybe later. Instead, I played around fine-tuned community versions of various smaller (>4B parameters) llms. For example, Indian langauges have community finetunes of **gemma** by **sarvam.ai**, or the **ai4Bharat**'s indictrans2. For popular european lanaguages like English, Spanish, French, most open-weight LLMs should work. Chinese models obivously work really well for european languages to Chinese. With **nllb** from meta as the last resort, we got the space decently covered.

Next, you gotta ensure the translator operates in the right context, so you need to wrap the targeted chunk of text with what's around it. I'd like to this of this as an artform, though the models are smart enough to work well in most cases. In difficult cases, like sarcasm or proverbs, it is harder to do well without bigger models. In between those two extremes lies the sweet spot where the speech is translated well, and is neither too long, nor too short, which is a real achievement.

Do note that languages tend to have different word rates. By that, I mean some languages use fewer words, others more. As a rule of thumb, even if you don't know the language, anyone who speaks really fast - like the Spanish - are more verbose. Inverse also holds. The bitrate of human understanding is more of less fixed, so audio captures this concept really well, but it gets lost in text. Another option would be to translate from source audio to target text. The results should be pretty nice and would more or less fit this pipeline. I'll probably add that.

Also, always identify the gender of the speaker. Can't emphasize this enough. Your translations are bound to fail otherwise. It sound so off. Too many cases still, but we take our major wins. Pareto principle when in doubt.

#### Text-to-speech
This part also had me beating my head on the wall. Every single good text-to-speach system has massive flaws. It works well for clear mononous understandable speech. You'd all have heard this - maps, voice assistants, announcements. There's a fakeness to them.

There are better methods and models, of cource, like XTTS v2 and the like that do admirably well in generating the audio and make it sound ok-ish. But the accent goes haywire and there's noise and sometimes it is garbled and alien. Others like parler allow you more freedom, by adding a description with the text, so the speech is more natural sounding. Again, there are so many parameters to tweak here that at one point I believed I had reached the limits of this method, and moved onto the speech-to-speech. XTTS v2 really is pretty decent though.

For TTS, stick to any model that produces natural speech, doesn't matter if all people sound the same. Better if there's already a bunch of presets. With speaker classification already available, map your OG characters to the voices available to you. Again, gender helps, because most models have male and female speakers, or high-pitch and low-pitch if you prefer. Find some long samples and be sure of your speaker's pitch, then match them to one of the presets. Voila.

### Speech-to-speech (S2S)
Enter Seamless M4T, again by Meta, that translates speech in one language to another. Their repertiore is pretty wide, and there's barely anything else that competes in the same arena. If there is, I have't found it. They have a bunch of preset voices, and have a bunch of issues like unnatural translations, finnicky audio outputs, etc. Again, speaker settings help. I had to generate voices for each speaker and listen to them to make an actual mapping since I couldn't find a reference. Not too bad though. I can see this by itself working pretty well for kid's shows with simple rhymes and simpler linguistic constructs. Done and dusted, not much more I could do with this.

### Voice cloning
And yet, discovery of **Chatterbox** changed things. Both their Multi-lingual TTS engine and the Voice cloning is surprisingly good. And they have nice packaged in a audio watermark in case I ever need to use it for another project where the audio goes online. Easy to use package, though together they cause kernel panic on M1. Who knew the new mtl ecosystem could beat the annoying CUDA Out of Memory that failed long jobs in the middle of the night. This one is worse though, the device freezes, a pink screen, and crashes. Yes, pink, a PSOD.

Anyway, ChatterboxVC is the secret sauce. Around it, I built a funky setup to find the right audio sample, and defaulted to just using the source audio that works like a charm. Shout out to you guys at **Resemble-ai**.

### Alignment
Ah, the simplest and the most tedious of them all. It isn't hard, as much as it is grunt work. Tweak the parameters, run a part of the pipeline again. What works sometimes doesn't work the others. But still, I found a decent compromise, while walking away my frustration. Our trust ffmpeg did a good job adjusting the volume and time stretch, which brings us to the last leg.

### Recombining
Simple. Normalize the vocals. Remember the background audio you made with demucs, hope you kept it. Put them back together. Bring the volume up. And we are done.

## Setup
I used an M1 Mac, 64 GB VRAM. On CPU mode, I was barely crossing 16, though you need the rest for all the youtube videos and shows you watching while the dub renders. The setup should work on a decent modern computer. Don't blow your laptops though, it is almost impossible to get the natural feeling audio with the smaller models currently available. I found 4B parameters a nice compromise. Do note, run Chatterbox on 'cpu', not 'mps'. Otherwise you are playing russian roulette with your computer, for each audio clip, so basically guaranteed crash for a serious show.

Some presets use metal library, but most are device agnostic, and should run end-to-end. The tasks require a lot of intermediate steps, but doing them sequentially should work on any nvidia gpu, even RTX 2080 or 1660 ti, though I haven't tested on them. There's also real limit to how much audio you can process in memory and all the ffmpeg stuff, which is quite CPU heavy.

You'd need python and pytorch and transformers for sure. Other requirements are available. I had to patch parler-tts for transformers>5.0 which I uploaded to git as well, and is present in the requirements.txt so you're welcome.


## Open Problems
### Lip Sync
We humans are pretty sensitive to lip sync. Audio and video being off makes the show unwatchable sometimes. Subtitles, and this whole project really, struggles with the lip syncing well. Even a simpler problem, matching lenght of dubbed audio to the original is hard. The word per minute thing of languages I mentioned, that they are different, that means we are stuck even if somehow manage the subtitles shifting well. The sudden speed up and slow down just don't feel that good, but neither does people talking over each other

### Prosody
Another open problem. It is hard to capture the natural speech, specially the dialogue kind. That annoyance with the artificial AI voice arises out of the fact that they sound absolutely unnatural despite mimicking voices so well. Again, the solutions I found make me happy enough to write this blog, but it is just not enough yet. I'll be training a bunch of LORAs to see if I can do a better job on my home setup than the research labs out there. Would love some free gpu credits if anyone's offering.

### Transcription / translation
As any ML model, there is a certain failure rate. It is down to pretty low after long hours and longs days of first exploring various models, and then tweaking the recipe just right. A lot like cooking really.

### Google / AI
I'm talking about the search engine. It is such a piece of trash right now. I asked simple pointed questions, it would return subpar AI summaries, and the top links under were never the ones I needed. Duckduckgo is so much better. Still, forgoing Claude for the most part made the project way harder. Like, more difficult than it used to be. 

## Conclusion
It was, and still is, a fun challenge, one that I spent nights awake for. I loved how slowly but surely the things came together. The cognitive challenge was worth it as well. I am pretty rusty as a developer, having offloaded most of the hard searching and debugging in the last year to Claude and local Qwen3.6. More ideas keep popping up. I certainly will make an audiobook tool as well, one I had always wanted but only now have the right components for.

Everything I used here was sort of novel (atleast for me), some of the niche models a month old, and other older models are someone's research project that lacked documentation or wasn't compatible with my environment. Or, you know, benchmaxed stuff that fails weirdly. Or just plain bad component identified after a bunch of hair pulling and frustrated walks. 

As I said, search engines are so bad for answers right now. The whole project should have been easy to fix manually if the newer answers were also being posted on github, stackoverflow, or some docs somewhere. Instead, I noticed everything is more AI friendly and less human-compatible. To be fair, it could be me being biased and used to the new normal of faster development cycle and lower cognitive loads. Still, I don't believe it is just that. 

That pretty much sums it up. I keep running into my own stupid programming bugs and numerous edge cases, so a lot of relearning. I also found out what's good and what's not in audio space, which I will be looking back at this blog for. And now I can watch hilarious dubs of normal shows at home. What fun.
