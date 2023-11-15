function calculateCentralPoint(coords) {
    const sum = coords.reduce((acc, val) => {
      return [acc[0] + val[0], acc[1] + val[1]];
    }, [0, 0]);
    return [sum[0] / coords.length, sum[1] / coords.length];
  }
  
module.exports = calculateCentralPoint;