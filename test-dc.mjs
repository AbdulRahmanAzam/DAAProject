import { divideAndConquerClosestPair, buildDivideComparisons } from './src/utils/divideAndConquer.js';

function randPts(n){
  const a=[];
  for(let i=0;i<n;i++) a.push({x:Math.random()*100,y:Math.random()*100});
  return a;
}

let mismatches=0;
for(let n=2;n<60;n++){
  for(let t=0;t<200;t++){
    const pts=randPts(n);
    const alg=divideAndConquerClosestPair(pts);
    const steps=buildDivideComparisons(pts);
    if(alg.comparisons!==steps.length){
      mismatches++;
      if(mismatches<5){
        console.log('Mismatch n',n,'alg',alg.comparisons,'steps',steps.length);
      }
      break;
    }
  }
}
console.log('Done mismatches',mismatches);
