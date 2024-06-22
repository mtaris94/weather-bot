const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require('discord.js');

const { fetchForecast } = require('../requests/forecast');

const data = new SlashCommandBuilder()
  .setName('astro')
  .setDescription('Replies with the astronomical information for the day!')
  .addStringOption((option) => {
    return option
      .setName('location')
      .setDescription('The location can be a city, zip/postal code, or a latitude and longitude.')
      .setRequired(true);
  })

async function execute(interaction) {
  await interaction.deferReply();

  const location = interaction.options.getString('location');

  try {
    const { weatherData, locationName, time } = await fetchForecast(location);

    const embed = new EmbedBuilder()
      .setColor(0x3f704d)
      .setTitle(`Astronomical forecast for ${locationName}...\n${time}`)
      .setTimestamp()
      .setFooter({
        text: 'Powered by the weatherapi.com API',
      });

    for (const day of weatherData) {
      

      embed.addFields({
        name: day.date,
        value: `🌅 Sunrise: ${day.sunriseTime}\n🌇 Sunset: ${day.sunsetTime}\n🌔 Moonrise: ${day.moonriseTime}\n🌘 Moonset: ${day.moonsetTime}\n🌙 Moon Phase: ${day.moon_phase}`,
      });
    }

    await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    await interaction.editReply(error);
  }
}

module.exports = {
  data,
  execute,
};