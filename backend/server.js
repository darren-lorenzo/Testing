require('dotenv').config();
const cors = require('cors');

const express = require('express');

const { initDatabase } = require('./Database/config/db.js');
const { initTokenScheduler } = require('./Module/TokenScheduler');

const authRoutes = require("./Api/Routes/Authentification/Oauth");
const loginRoute = require('./Api/Routes/Authentification/login');
const registerRoute = require('./Api/Routes/Authentification/register');
const refreshTokenRoute = require('./Api/Routes/Authentification/refreshToken');

const ServiceRoute = require('./Api/Routes/Service');
const ActionRoute = require('./Api/Routes/Actions');
const ReactionRoute = require('./Api/Routes/Reactions.js');
const AreaRoute = require('./Api/Routes/Area.js');
const AdminRoute = require('./Api/Routes/Admin.js');
const UserRoute = require('./Api/Routes/User.js');
const aboutRoute = require("./Api/Routes/about");
const TemplateAreaRoute = require('./Api/Routes/TemplateArea.js')

const UserModel = require('./Database/models/User');
const ServicesModel = require('./Database/models/Services');
const ActionsModel = require('./Database/models/Actions.js');
const ReactionsModel = require('./Database/models/Reactions.js');
const WorkflowsModel = require('./Database/models/Workflow.js');
const AdminsModel = require('./Database/models/Admin.js');
const TemplateAreaModel = require('./Database/models/Template_area.js');

let User;
let Services;
let Actions;
let Reactions;
let Workflows;
let TemplateAreas;

const app = express();

app.use(express.json());

app.use(cors({
    origin: (origin, callback) => {
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/api/login', loginRoute);
app.use('/api/register', registerRoute);
app.use("/api/auth", authRoutes);
app.use('/api/refresh', refreshTokenRoute);

app.use("/api/service", ServiceRoute);
app.use("/api/action", ActionRoute);
app.use("/api/reaction", ReactionRoute);
app.use("/api/user", UserRoute);
app.use("/api/area", AreaRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/templates", TemplateAreaRoute);

app.use("/", aboutRoute);

(async () => {
    try {
        const sequelize = await initDatabase();

        if (sequelize) {
            User = UserModel(sequelize);
            global.User = User;

            Services = ServicesModel(sequelize);
            global.Services = Services;

            Workflows = WorkflowsModel(sequelize);
            global.Workflows = Workflows;

            Actions = ActionsModel(sequelize);
            global.Actions = Actions;

            Reactions = ReactionsModel(sequelize);
            global.Reactions = Reactions;

            Admins = AdminsModel(sequelize);
            global.Admins = Admins;

            TemplateAreas = TemplateAreaModel(sequelize);
            global.AreaTemplates = TemplateAreas;

            await sequelize.sync({ alter: true });
            console.log('tables synchronized');

            initTokenScheduler(User);
        }
    } catch (error) {
        console.error('Database initialization error:', error);
    }
})();

app.get("/", (req, res) => {
    res.json({ message: "AREA Backend is running !" });
});

const PORT = process.env.PORT;
app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);

const runPolling = require("./Module/ServicesManagement/polling");

setInterval(() => {
    console.log("[POLLING] checking workflows...");
    runPolling();
}, 10_000);