const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] 
});

const DOCS_URL = 'https://viper-development-1.gitbook.io/viper-development-docs/';
const TEBEX_URL = 'https://your-tebex-store.com'; // 🟢 CHANGE THIS TO YOUR TEBEX LINK
const CHANNEL_ID = '1469318831112716320'; 
let statusMessage = null;

client.once('ready', async () => {
    console.log(`✅ Monitoring started for Docs and Tebex`);
    const channel = await client.channels.fetch(CHANNEL_ID);

    setInterval(async () => {
        // Check Docs Status
        let docsOnline = false;
        try { const res = await axios.get(DOCS_URL); if (res.status === 200) docsOnline = true; } catch (e) { docsOnline = false; }

        // Check Tebex Status
        let tebexOnline = false;
        try { const res = await axios.get(TEBEX_URL); if (res.status === 200) tebexOnline = true; } catch (e) { tebexOnline = false; }

        const statusEmbed = new EmbedBuilder()
            .setTitle('Viper Development | System Status')
            .setColor(docsOnline && tebexOnline ? 0x2b2d31 : 0xff0000)
            .addFields(
                { 
                    name: '📚 Documentation', 
                    value: `${docsOnline ? '🟢 **Operational**' : '🔴 **Offline**'}\n[View Site](${DOCS_URL})`, 
                    inline: true 
                },
                { 
                    name: '🛒 Tebex Store', 
                    value: `${tebexOnline ? '🟢 **Operational**' : '🔴 **Offline**'}\n[View Shop](${TEBEX_URL})`, 
                    inline: true 
                }
            )
            .setFooter({ text: 'Status updates every minute' })
            .setTimestamp();

        if (!statusMessage) {
            statusMessage = await channel.send({ embeds: [statusEmbed] });
        } else {
            await statusMessage.edit({ embeds: [statusEmbed] }).catch(() => { statusMessage = null; });
        }
    }, 60000); 
});

client.login(process.env.DISCORD_TOKEN);
