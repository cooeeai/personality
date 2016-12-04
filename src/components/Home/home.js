import Vue from 'vue';
import template from './home.html';
import { personalityResource } from 'src/helpers/resources';

export default Vue.extend({
  template,

  data() {
    return {
      purchasingPreferences: {}
    };
  },

  created() {
    this.fetchPersonality();
  },

  methods: {
    fetchPersonality() {
      return personalityResource.get({ id: 1234 }).then((response) => {
        let json;
        if (response.data && typeof response.data === 'object') {
          json = response.data;
        } else {
          json = JSON.parse(response.data);
        }
        const consumptionPreferences = json.consumption_preferences;
        const purchasingPreferences = consumptionPreferences.filter((p) => {
          return p.consumption_preference_category_id === 'consumption_preferences_shopping';
        })[0].consumption_preferences;
        const sorted = purchasingPreferences.sort((a, b) => {
          if (a.score > b.score) {
            return 1;
          }
          if (a.score < b.score) {
            return -1;
          }
          return 0;
        });
        const likely = sorted.filter((p) => p.score > 0.5).slice(0, 4);
        const unlikely = sorted.reverse().filter((p) => p.score <= 0.5).slice(0, 4);
        this.purchasingPreferences = {
          likely,
          unlikely
        };
      }, (err) => {
        // handle error
        console.log('API responded with:', err.status);
      });
    }
  }
});
