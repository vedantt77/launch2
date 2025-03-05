import { Startup } from '@/lib/types';
import { saasdirectories } from './saasdirectories';
import { betterpic } from './betterpic';
import { legitcheck } from './legitcheck';
import { integrately} from './integrately';
import { techlockdown} from './techlockdown';
import { writeas} from './writeas';
import { chatbase} from './chatbase';
import { songstats} from './songstats';
import { afforai} from './afforai';
import { senja} from './senja';
import { rezi} from './rezi';
import { autoshotai} from './autoshotai';


export const startups: Startup[] = [
  
  saasdirectories,
  chatbase,
  rezi,
  autoshotai,
  senja,
  afforai,
  betterpic,
  legitcheck,
  integrately,
  songstats,
  writeas,
  techlockdown,
];