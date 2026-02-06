const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
});

const WEBSITE_URL = 'https://viper-development-1.gitbook.io/viper-development-docs/'; 
const STORE_URL = 'https://viper-development.tebex.io/';
const CHANNEL_ID = '1469318831112716320'; 
let statusMessage = null; 

client.once('ready', async () => {
    console.log(`✅ Monitoring: ${WEBSITE_URL}`);
    const channel = await client.channels.fetch(CHANNEL_ID);

    setInterval(async () => {
        let websiteOnline = false;
        let storeOnline = false;

        try {
            const res = await axios.get(WEBSITE_URL);
            if (res.status === 200) websiteOnline = true;
        } catch (e) { websiteOnline = false; }

        try {
            const resStore = await axios.get(STORE_URL);
            if (resStore.status === 200) storeOnline = true;
        } catch (e) { storeOnline = false; }

        const statusEmbed = new EmbedBuilder()
            .setTitle('Viper Development | System Status')
            .addFields(
                { name: '📚 Documentation', value: `${websiteOnline ? '🟢 Operational' : '🔴 Offline'}\n[View Site](${WEBSITE_URL})`, inline: true },
                { name: '🛒 Tebex Store', value: `${storeOnline ? '🟢 Operational' : '🔴 Offline'}\n[View Shop](${STORE_URL})`, inline: true }
            )
            .setColor(0x2f3136) 
            .setFooter({ text: 'Status updates every minute' })
            .setTimestamp();

        if (!statusMessage) {
            statusMessage = await channel.send({ embeds: [statusEmbed] });
        } else {
            await statusMessage.edit({ embeds: [statusEmbed] }).catch(() => {
                statusMessage = null; 
            });
        }
    }, 60000); // 60,000ms = 1 Minute
});

client.login(process.env.DISCORD_TOKEN);
