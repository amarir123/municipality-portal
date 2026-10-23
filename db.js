// MVC MODEL ADAPTER FOR BACKWARDS COMPATIBILITY & SAAS SYSTEM
import { NewsModel } from './js/models/NewsModel.js';
import { ProjectModel } from './js/models/ProjectModel.js';
import { PublicationModel } from './js/models/PublicationModel.js';
import { EventModel } from './js/models/EventModel.js';
import { BrandingModel } from './js/models/BrandingModel.js';
import { VideoModel } from './js/models/VideoModel.js';
import { ComplaintModel } from './js/models/ComplaintModel.js';
import { ServiceModel } from './js/models/ServiceModel.js';
import { MandateModel } from './js/models/MandateModel.js';
import { SynthesisReportModel } from './js/models/SynthesisReportModel.js';
import { SubventionModel } from './js/models/SubventionModel.js';
import { PollModel } from './js/models/PollModel.js';

// Init models
NewsModel.init();
ProjectModel.init();
PublicationModel.init();
EventModel.init();
BrandingModel.init();
VideoModel.init();
ComplaintModel.init();
ServiceModel.init();
MandateModel.init();
SynthesisReportModel.init();
SubventionModel.init();
PollModel.init();

export const db = {
    getNews: () => NewsModel.getAll(),
    saveNews: (data) => NewsModel.saveAll(data),
    getProjects: () => ProjectModel.getAll(),
    saveProjects: (data) => ProjectModel.saveAll(data),
    getPublications: () => PublicationModel.getAll(),
    savePublications: (data) => PublicationModel.saveAll(data),
    getEvents: () => EventModel.getAll(),
    saveEvents: (data) => EventModel.saveAll(data),
    getBranding: () => BrandingModel.get(),
    saveBranding: (data) => BrandingModel.save(data),
    getVideos: () => VideoModel.getAll(),
    saveVideos: (data) => VideoModel.saveAll(data),
    getComplaints: () => ComplaintModel.getAll(),
    saveComplaints: (data) => ComplaintModel.saveAll(data),
    addComplaint: (data) => ComplaintModel.add(data),
    getServices: () => ServiceModel.getAll(),
    saveServices: (data) => ServiceModel.saveAll(data),
    getMandate: () => MandateModel.get(),
    saveMandate: (data) => MandateModel.save(data),
    getSynthesisReport: () => SynthesisReportModel.get(),
    saveSynthesisReport: (data) => SynthesisReportModel.save(data),
    getSubventions: () => SubventionModel.get(),
    saveSubventions: (data) => SubventionModel.save(data),
    getPolls: () => PollModel.getAll(),
    getActivePoll: () => PollModel.getActivePoll(),
    exportPackage: () => BrandingModel.exportPackageJSON(),
    importPackage: (jsonStr) => BrandingModel.importPackageJSON(jsonStr)
};

window.agadirDB = db;
