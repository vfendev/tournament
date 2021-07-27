const readlineSync = require("readline-sync");
const fs = require("fs");
const path = require("path");

main = () => {

  let rawdata = fs.readFileSync(path.resolve(__dirname, "tennisPlayers.json"));
  let tennisPlayers = JSON.parse(rawdata);

  // const N = readlineSync.question("Unesite broj tenisera (N):");

  // const allowedValues = ["4", "8", "16", "32", "64"];
  // if (allowedValues.indexOf(N) < 0)
  //   throw new Error(
  //     "Dozvoljeni broj prijavljenih igraca je 4, 8, 16, 32 i 64."
  //   );

  // let tennisPlayers = [];

  // for (var i = 0; i < N; i++) {
  //   const tempTennisPlayer = readlineSync.question(
  //     "Unesite tenisera u obliku [ime],[prezime],[drzava],[ranking]:"
  //   );

  //   const tempTennisPlayerData = tempTennisPlayer.split(",");

  //   tennisPlayers.push({
  //     firstName: tempTennisPlayerData[0],
  //     lastName: tempTennisPlayerData[1],
  //     country: tempTennisPlayerData[2],
  //     ranking: parseInt(tempTennisPlayerData[3]),
  //   });
  // }

  tennisPlayers.map((obj) => (obj.score = 0));

  const rankMap = {};

  tennisPlayers.forEach((tennisPlayer) => {
    if (tennisPlayer.ranking < 1) {
      throw new Error("Rank ne moze biti manji od 1.");
    } else if (isNaN(tennisPlayer.ranking)) {
      throw new Error("Rank mora biti broj");
    } else if (rankMap[tennisPlayer.ranking]) {
      throw new Error("Igraci ne mogu imati isti rank.");
    } else {
      rankMap[tennisPlayer.ranking] = true;
    }
  });

  let pairs = [];
  let winners = [];
  let round = 1;

  const checkRanking = (player1, player2) => {
    if (
      player1.ranking + 1 !== player2.ranking &&
      player1.ranking - 1 !== player2.ranking &&
      player2.ranking + 1 !== player1.ranking &&
      player2.ranking - 1 !== player1.ranking
    ) {
      return true;
    } else {
      return false;
    }
  };

  const createMatches = () => {
    let tempPair = [];
    while (tennisPlayers.length > 0) {
      tennisPlayers.map((player) => {
        if (tempPair.length === 0) {
          tempPair.push(player);
          tennisPlayers.splice(tennisPlayers.indexOf(player), 1);
        } else {
          if ((checkRanking(player, tempPair[0]) && round === 1) || round > 1) {
            tempPair.push(player);
            tennisPlayers.splice(tennisPlayers.indexOf(player), 1);
            pairs.push(tempPair);
            tempPair = [];
          } else {
            tennisPlayers.push(tempPair[0]);
            createMatches(tennisPlayers);
            return;
          }
        }
      });
    }

    if (pairs.length === 1) {
      console.log(`Runda ${round} / Finale:`);
    } else if (pairs.length === 2) {
      console.log(`Runda ${round} / Polufinale:`);
    } else if (pairs.length === 4) {
      console.log(`Runda ${round} / Cetvrt finale:`);
    } else {
      console.log(`Runda ${round}:`);
    }

    getWinners(pairs);
    let matchNumber = 0;

    pairs.map((player) => {
      matchNumber += 1;
      console.log(
        `${matchNumber}.  ${player[0].firstName.charAt()}. ${
          player[0].lastName
        } (${player[0].country}, ${player[0].ranking})  ${player[0].score} - 
        ${player[1].score}  ${player[1].firstName.charAt()}. ${
          player[1].lastName
        } (${player[1].country}, ${player[1].ranking})`
      );
    });

    pairs = [];
    if (winners.length > 1) {
      createMatches(tennisPlayers);
    } else {
      tennisPlayers = [];
      console.log("Pobednik:");
      console.log(
        `!!! ${winners[0].firstName.charAt()}. ${winners[0].lastName} (${
          winners[0].country
        }, ${winners[0].ranking}) !!!`
      );
      return;
    }
  };

  const getWinners = (pairs) => {
    pairs.map((player) => {
      let winnerIndex = Math.floor(Math.random() * 2);
      winners.push(player[winnerIndex]);
      player[winnerIndex].score = 2;
      player[1 - winnerIndex].score = Math.floor(Math.random() * 2);
    });

    tennisPlayers = winners;
    round++;
  };

  createMatches(tennisPlayers);
};

main();
