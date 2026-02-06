const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
});

const WEBSITE_URL = 'https://viper-development-1.gitbook.io/viper-development-docs/'; 
const CHANNEL_ID = '1469318831112716320'; 
let statusMessage = null; // Stores the message so we can edit it

client.once('ready', async () => {
    console.log(`✅ Monitoring: ${WEBSITE_URL}`);
    const channel = await client.channels.fetch(CHANNEL_ID);

    setInterval(async () => {
        let isOnline = false;
        try {
            const res = await axios.get(WEBSITE_URL);
            if (res.status === 200) isOnline = true;
        } catch (e) { isOnline = false; }

        const statusEmbed = new EmbedBuilder()
            .setTitle('Website Status')
            .setDescription(isOnline ? '🟢 **Online**\n`IIIIIIIIIIIIIIIIIIII` 100%' : '🔴 **Offline**')
            .setColor(isOnline ? 0x2f3136 : 0xff0000) // Professional dark grey or red
            .setFooter({ text: 'Last Updated' })
            .setTimestamp();

        if (!statusMessage) {
            // First time: send a new message
            statusMessage = await channel.send({ embeds: [statusEmbed] });
        } else {
            // Every time after: just EDIT the message
            await statusMessage.edit({ embeds: [statusEmbed] }).catch(() => {
                statusMessage = null; // Reset if message was deleted
            });
        }
    }, 60000); // 60,000ms = 1 Minute
});

client.login(process.env.DISCORD_TOKEN);
