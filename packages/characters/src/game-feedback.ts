import {
  actionForEvent,
  completeMimo,
  transitionMimo,
  type AnimationState,
  type MimoEvent,
} from './animation.js';
import {feedbackForEvent, type MascotFeedback} from './feedback.js';

/**
 * An ephemeral, UI-only event contract for the Kids mascot.
 *
 * An actual game must mint a unique event ID once for each logical event;
 * rendering/retrying that same event must reuse the ID. The reducer never
 * updates XP, achievement records, analytics, or child identity.
 */
export type MascotGameEvent = Readonly<{
  id:string;
  type:MimoEvent;
}>;

export type MascotGameFeedbackState = Readonly<{
  animation:AnimationState;
  recentIds:readonly string[];
  feedback:Readonly<{eventId:string;value:MascotFeedback;serial:number}>|null;
}>;

export type MascotGameFeedbackDecision = Readonly<{
  state:MascotGameFeedbackState;
  status:'accepted'|'duplicate'|'suppressed';
}>;

export function initialMascotGameFeedbackState():MascotGameFeedbackState {
  return {animation:{action:'idle',startedAt:0,serial:0},recentIds:[],feedback:null};
}

const eventIdPattern=/^[a-zA-Z0-9_.:-]{1,128}$/;
const maxRecentIds=64;

export function applyMascotGameEvent(
  state:MascotGameFeedbackState,
  event:MascotGameEvent,
  now:number,
):MascotGameFeedbackDecision {
  if(!eventIdPattern.test(event.id))throw new Error('Invalid mascot event ID');
  if(!Number.isFinite(now)||now<0)throw new Error('Invalid mascot event clock');
  if(state.recentIds.includes(event.id))return {state,status:'duplicate'};

  const recentIds=[...state.recentIds,event.id].slice(-maxRecentIds);
  const next=transitionMimo(state.animation,actionForEvent(event.type),now);
  if(next===state.animation) {
    return {status:'suppressed',state:{...state,recentIds}};
  }
  return {
    status:'accepted',
    state:{
      animation:next,
      recentIds,
      feedback:{eventId:event.id,value:feedbackForEvent(event.type),serial:next.serial},
    },
  };
}

/**
 * Complete an expired motion without inventing a new reaction or repeating XP.
 * Bubble TTL is independently handled by the UI.
 */
export function settleMascotGameFeedback(
  state:MascotGameFeedbackState,
  now:number,
):MascotGameFeedbackState {
  const animation=completeMimo(state.animation,now);
  return animation===state.animation?state:{...state,animation};
}
