const Discord = require('discord.js');
const client = new Discord.Client();
let prefix = "*";
const ytdl = require('ytdl-core');
const queue = new Map();
let servers = {};
client.login("NTE4MTI5NTc3ODU2MzM1ODgy.DuMSzQ.wputsIYkgWiPX5u6PVPns2sweQY");
function play(connection, message)
{
    let server = servers[message.guild.id];
    server.dispatcher = connection.playSteam(ytdl(server.queue[0], {filter: "audioonly"}));
    server.queue.shift();
    server.dispatcher.on("end", function()
    {
        if(server.queue[0])
        {
            play(connection, message);
        }
        else
        {
            connection.disconnect();
        }
    });
}
client.on("ready", () => 
{
    console.log("I am ready!");
    client.user.setGame("TOMB RAIDER");
});
client.on('message', message => 
{
    if(message.content === prefix + "Bonjour")
    {
        message.reply("Salut");
    }// si je veux qu'il me réponde quand je mets autre chose que bonjour il faudra mettre des else if.
    /**
     * Menu d'aide
     */
    if(message.content === prefix + "help") 
    {
        let aide_embed = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle(`:robot: Voici mes catégories d'aide !`)
        .setDescription(`Voici mes commandes disponible :`)
        .setThumbnail(message.author.avatarURL)
        .addField(":tools: Modération", "Fais `*mod` pour voir mes commandes de modération !")
        .addField(":tada: Fun", "Fais `*fun` pour voir mes commandes d'animation !")
        .setFooter("Menu d'aide - Tuto YouTube")
        .setTimestamp()
        message.channel.send(aide_embed);
    }
    if(message.content === prefix + "mod") 
    {
        let mod_embed = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle(`:tools: Voici mes commandes modérations !`)
        .setThumbnail(message.author.avatarURL)
        .addField("*kick <@user>", "Kick l'utilisateur !")
        .addField("*ban <@user>", "Ban l'utilisateur !")
        .addField("*clear nombre", "Supprime le nombre de messages indiqué")
        .addField("*mute <@user>", "Mute l'utilisateur mentionné")
        .addField("*unmute <@user>", "Unmute l'utilisateur mentionné")
        .setFooter("Commande modération - Tuto YouTube")
        .setTimestamp()
        message.channel.send(mod_embed);
    }
    if(message.content === prefix + "fun") 
    {
        let fun_embed = new Discord.RichEmbed()
        .setColor('#FF0000')
        .setTitle(`:tools: Voici mes commandes amusantes !`)
        .setThumbnail(message.author.avatarURL)
        .addField("Bonjour", "Le bot répond !")
        .addField("*statistiques", "Le bot vous envoie des informations sur votre profil !")
        .addField("*info", "Donne des indormations sur le bot et le serveur !")
        .setFooter("Commande modération - Tuto YouTube")
        .setTimestamp()
        message.channel.send(fun_embed);
    }
    if(message.content === prefix + "info")
    {
        //guild = serveur
        let info_embed = new Discord.RichEmbed()
        .setColor("#FF0000")
        .setTitle("Here is the information about me and about the server.")
        .addField(" :robot: Nom : ", `${client.user.tag}`, true)
        .addField("Bot's discriminator :hash:", `#${client.user.discriminator}`)
        .addField("Id :id:", `${client.user.id}`)
        .addField("Number of user in the server", message.guild.members.size)
        .addField("Number of categories and living room", message.guild.channels.size)
        .setFooter("Informations");
        message.channel.sendMessage(info_embed);
        console.log("Un utilisateur a effectué la commande d'info!")
    }
    if(message.content.startsWith(prefix + "kick"))
    {
        if(!message.guild.member(message.author).hasPermission("KICK_MEMBERS"))
        {
            return message.channel.send("Vous n'avez pas la persmission!");
        }
        if(message.mentions.users.size === 0)
        {
            return message.channel.send("Vous devez mentionner un utilisateur");
        }
        let kick = message.guild.member(message.mentions.users.first());
        if(!kick)
        {
            return message.channel.send("Je ne sais pas si l'utilisateur existe :/");
        }
        if(!message.guild.member(client.user).hasPermission("KICK_MEMBERS"))
        {
            return message.channel.send("Je n'ai pas la permission pour kick");
        }
        kick.kick().then(member => 
        {
            message.channel.send(`${member.user.username} est kick par ${message.author.username}!`);
        });
    }
    if(message.content.startsWith(prefix + "ban"))
    {
        if(!message.guild.member(message.author).hasPermission("BAN_MEMBERS"))
        {
            return message.channel.send("Vous n'avez pas la permission.");
        }
        if(message.mentions.users.size === 0)
        {
            return message.channel.send("Vous devez mentionner un utilisateur");
        }
        let ban = message.guild.member(message.mentions.users.first());
        if(!ban)
        {
            return message.channel.send("Je ne sais pas si l'utilisateur existe.");
        }
        if(!message.guild.member(client.user).hasPermission("BAN_MEMBERS"))
        {
            return message.channel.send("Je n'ai pas la persmission pour ban.");
        }
        ban.ban().then(member => 
        {
            message.channel.send(`${member.user.username} est ban par ${message.author.username}!`);
        });
    }
    if(message.content.startsWith(prefix + "clear"))
    {
        if(!message.guild.member(message.author).hasPermission("MANAGE_MESSAGE"))
        {
            return message.channel.send("Vous n'avez la permission!");
        }
        let args = message.content.split(" ").slice(1);
        if(!args[0])
        {
            return message.channel.send("Tu dois préciser un nombre de message à supprimer !");
        }
        message.channel.bulkDelete(args[0]).then(() =>
        {
            message.channel.send(`${args[0]} messages ont été supprimés !`);
        });
    }
    if(message.content.startsWith(prefix + "mute"))
    {
        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR"))
        {
            return message.channel.send("Vous n'avez pas la persmission!");
        }
        if(message.mentions.users.size === 0)
        {
            return message.channel.send("Vous devez mentionner un utilisateur.");
        }
        let mute = message.guild.member(message.mentions.users.first());
        if(!mute)
        {
            return message.channel.send("Je n'ai pas trouver l'utilisateur ou il n'existe pas");
        }
        if(!message.guild.member(client.user).hasPermission("ADMINISTRATOR"))
        {
            return message.channel.send("Je n'ai pas la persmission");
        }
        message.channel.overwritePermissions(mute, {SEND_MESSAGES : false}).then(member =>
        {
            message.channel.send(`${mute.user.username} est mute !`);
        });
    }
    if(message.content.startsWith(prefix + "unmute"))
    {
        if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR"))
        {
            return message.channel.send("Vous n'avez pas la persmission!");
        }
        if(message.mentions.users.size === 0)
        {
            return message.channel.send("Vous devez mentionner un utilisateur.");
        }
        let mute = message.guild.member(message.mentions.users.first());
        if(!mute)
        {
            return message.channel.send("Je n'ai pas trouver l'utilisateur ou il n'existe pas");
        }
        if(!message.guild.member(client.user).hasPermission("ADMINISTRATOR"))
        {
            return message.channel.send("Je n'ai pas la persmission");
        }
        message.channel.overwritePermissions(mute, {SEND_MESSAGES : true}).then(member =>
        {
            message.channel.send(`${mute.user.username} n'est plus mute !`);
        });
    }
    if(!message.content.startsWith(prefix)) 
    {
        return;
    }
    let args = message.content.substring(prefix.length).split(" ");
    switch(args[0].toLowerCase())
    {
        case "statistiques":
            let userCreateDate = message.author.createdAt.toString().split(" ");
            let msgAuthor = message.author.id;
            let stats_embed = new Discord.RichEmbed().setColor("#FF0000").setTitle(`Statistiques de l'utlisateur : ${message.author.username}`).addField(`Id de l'utilisateur :id:`, msgAuthor, true)
            .addField("Date de création de l'utilisateur :", userCreateDate[1] + ' ' + userCreateDate[2] + ' ' + userCreateDate[3]).setThumbnail(message.author.avatarURL);
            message.reply("Tu peux regarder tes message privés. Tu viens de recevoir tes statistiques.");
            message.author.send({embed : stats_embed});
            break;
    }
});
