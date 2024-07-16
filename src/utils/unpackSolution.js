const unpackSolution = (solutionString) => {
    return solutionString.split(';').map((move) => {
      const [from, toAndPromotion] = move.split('-');
      const to = toAndPromotion.slice(0, 2);
      const promotion =
        toAndPromotion.length > 2 ? toAndPromotion[2] : undefined;
      return { from, to, promotion };
    });
  };
  
  export default unpackSolution;
  