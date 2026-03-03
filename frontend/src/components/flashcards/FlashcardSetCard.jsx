import React from 'react';
import {useNavigate} from 'react-router-dom';
import { BookOpen,Sparkles,TrendingUp } from 'lucide-react';
import moment from 'moment';

const FlashcardSetCard = ({flashcardSet}) => {

    const navigate = useNavigate();

    const handleStudyNow = () => {
        navigate(`/documents/${flashcardSet.documentId._id}/flashcards`);
    };

    const reviewedCount = flashcardSet.cards.filter(card=>card.lastReviewed).length;
    const totalCards = flashcardSet.cards.length;
    const progressPercentage = totalCards > 0 ? Math.round((reviewedCount/totalCards)*100) : 0;


    return (
        <div 
        className=''
        onClick={handleStudyNow}
        >
           <div className=''>
              {/*Icon and Title*/}
              <div className=''>
                 <div className=''>
                    <BookOpen className='' strokeWidth={2}/>
                 </div>
                 <div className=''>
                   <h3 className='' title={flashcardSet?.documentId?.title}>
                    {flashcardSet?.documentId?.title}
                   </h3>
                   <p className=''>
                      Created {moment(flashcardSet.createdAt).fromNow()}
                   </p>
                 </div>
              </div>

              {/*Stats*/}
              <div className=''>
                 <div className=''>
                    <span className=''>
                        {totalCards}{totalCards===1 ? 'Card' : 'Cards'}
                    </span>
                 </div>
                 {reviewedCount > 0 && (
                    <div className=''>
                       <TrendingUp className='' strokeWidth={2.5}/>
                       <span className=''>
                        {progressPercentage}%
                       </span>
                    </div>
                 )}
              </div>

              {/*Progress Bar*/}
              
           </div>
        </div>
    )
}

export default FlashcardSetCard;