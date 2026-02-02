/**
 * split text into chunks for better AI processing
 * @param {string} text - full text to chunk
 * @param {number} chunkSize - target size per chunk (in words)
 * @param {number} overlap - number of words to overlap between chunks
 * @returns {Array<{content: string,chunkIndex: number,pageNumber: number}>}
 * */ 

export const chunkText = (text,chunkSize = 500,overlap = 50)=>{
   if(!text || text.trim().length === 0){
    return [];
   }

   //clean text while preserving paragraph structure
   const cleanedText = text
   .replace(/\r\n/g,'\n')
   .replace(/\s+/g,'')
   .replace(/\n/g,'\n')
   .replace(/\n/g,'\n')
   .trim();

   //try to split by paragraphs (single or double newlines)
   const paragraphs = cleanedText.split(/\n+/).filter(p=>p.trim().length>0);

   const chunks = [];
   let currentChunk = [];
   let currentWordCount = 0;
   let chunkIndex = 0;

   for(const paragraph of paragraphs){
    const paragraphWords = paragraph.trim().split(/\s+/);
    const paragraphWordCount = paragraphWords.length;

    //if single paragraph exceeds chunk isze , split it by words
    if(paragraphWordCount > chunkSize){
        if(currentChunk.length>0){
            chunks.push({
                content: currentChunk.join('\n\n'),
                chunkIndex: chunkIndex++,
                pageNumber:0
            });
            currentChunk = [];
            currentWordCount = 0;
        }

        //split large paragraph into word based chunks 
        for(let i=0;i<paragraphWords.length;i+=(chunkSize-overlap)){
            const chunkWords = paragraphWords.slice(i,i+chunkSize);
            chunks.push({
                content: chunkWords.join(' '),
                chunkIndex: chunkIndex++,
                pageNumber:0 
            });
            if(i+chunkSize>=paragraphWords.length) break;
        }
        continue;
    }

    //if adding this paragraph exceeds chunk size , save current chunk
    if(currentWordCount+paragraphWordCount>chunkSize && currentChunk.length>0){
        chunks.push({
            content: currentChunk.join('\n\n'),
            chunkIndex: chunkIndex++,
            pageNumber: 0
        });

        //create overlap from previous chunks 
        const prevChunkText = currentChunk.join(' ');
        const prevWords = prevChunkText.split(/\s+/);
        const overlapText = prevWords.slice(-Math.min(overlap,prevWords.length)).join(' ');

        currentChunk = [overlapText,paragraph.trim()];
        currentWordCount = overlapText.split(/\s+/).length+paragraphWordCount;
    }else{
        //add paragraph to current chunk
        currentChunk.push(paragraph.trim());
        currentWordCount += paragraphWordCount;
    }
   }

   //add the last chunk
   if(currentChunk.length>0){
    chunks.push({
        content: currentChunk.join('\n\n'),
        chunkIndex: chunkIndex,
        pageNumber: 0
    });
   }

   //fallback: if no chunks created , split by words
   if(chunks.length === 0 && cleanedText.length>0){
      const allWords = cleanedText.split(/\s+/);
      for(let i=0;i<allWords.length;i+=(chunkSize-overlap)){
        const chunkWords = allWords.slice(i,i+chunkSize);
        chunks.push({
            content: chunkWords.join(' '),
            chunkIndex: chunkIndex++,
            pageNumber: 0
        });

        if(i+chunkSize >= allWords.length) break;
      }
   }
   return chunks;

};


/**
 * find relevant chunks based on keyword matching
 * @param {Array<Object>} chunks - Array of chunks
 * @param {string} query - search query
 * @param {number} maxChunks - maximum chunks to return
 * @returns {Array<Object>}
 */

export const findRelevantChunks = (chunks,query,maxChunks = 3) => {
    if(!chunks || chunks.length === 0 || !query){
        return [];
    }

    //common stop words to exclude
    const stopWords = new Set([
        'the','is','at','which','on','a','an','and','or','but',
        'in','with','to','for','of','as','by','this','that','it'
    ]);

    //extract and clean query words
    const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter(w=>w.length>2 && !stopWords.has(w));

    if(queryWords.length === 0){
        //return clean chunk objects without mongoose metadata
        return chunks.slice(0,maxChunks).map(chunk=>({
            content: chunk.content,
            chunkIndex: chunk,chunkIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id
        }));
    }

    const scoredChunks = chunks.map((chunk,index)=>{
        const content = chunk.content.toLowerCase();
        const contentWords = content.split(/\s+/).length;
        let score = 0;

        //score each query word
        for(const word of queryWords){
            //exact word match(higher score)
            const exactMatches = (content.match(new RegExp(`\\b${word}\\b`,'g')) || []).length;
            score+=exactMatches*3;

            //partial match(lower case)
            const partialMatches = (content.match(new RegExp(word,'g')) || []).length;
            score+=Math.max(0,partialMatches-exactMatches)*1.5;
        }

        //bonus: multiple query words found
        const uniqueWordsFound = queryWords.filter(word=>
            content.includes(word)
        ).length;
        if(uniqueWordsFound>1){
            score+=uniqueWordsFound*2;
        }

        //normalize by content length
        const normalizedScore = score/Math.sqrt(contentWords);

        //small words for earlier chunks 
        const positionBonus = 1-(index/chunks.length)*0.1;

        //return clean object without mongoose metadata
        return{
            context: chunk.context,
            chunkIndex: chunk.chuckIndex,
            pageNumber: chunk.pageNumber,
            _id: chunk._id,
            score: normalizedScore*positionBonus,
            rawScore: score,
            matchedWords: uniqueWordsFound
        };
    });

    return scoredChunks
    .filter(chunk=>chunk.score>0)
    .sort((a,b)=>{
        if(b.score !== a.score){
            return b.score-a.score;
        }
        if(b.matchedWords !== a.matchedWords){
            return b.matchedWords-a.matchedWords;
        }
        return a.chunkIndex-b.chunkIndex;
    })
    .slice(0,maxChunks);
};