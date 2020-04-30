var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name:'ModaMedicServer',
    description: 'server',
    script: 'C:\\Users\\User\\WebstormProjects\\ModaMedicServer\\bin\\www'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
    svc.start();
});

svc.on('uninstall',function () {
    svc.stop();
});

svc.install();
//svc.uninstall(); //change to this when want to REMOVE task and run locally


