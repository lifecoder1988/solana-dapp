import axios from "axios";

export default class LotterySDK {
  apiHost: string;
  constructor(apiHost: string) {
    this.apiHost = apiHost;
  }

  async getActiveRound() {
    try {
      const { data } = await axios.get(`${this.apiHost}/rounds/active`);

      return data["data"];
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  async getRound(roundId: string) {
    try {
      const { data } = await axios.get(
        `${this.apiHost}/rounds/detail/${roundId}`
      );

      return data["data"];
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  async getOlderRound() {
    try {
      const { data } = await axios.get(`${this.apiHost}/rounds/older`);

      return data["data"];
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  async getPendingRound() {
    try {
      const { data } = await axios.get(`${this.apiHost}/rounds/pending`);

      return data["data"];
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  async listTicketsByOwner(owner: string) {
    try {
      const { data } = await axios.get(
        `${this.apiHost}/tickets/list_by_owner?owner=${owner}`
      );

      return data["data"];
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  async listTicketsByRoundId(roundId: string) {
    try {
      const { data } = await axios.get(
        `${this.apiHost}/tickets/list_by_round?round_id=${roundId}`
      );

      return data["data"];
    } catch (err) {
      console.log(err);
    }
    return null;
  }
}
