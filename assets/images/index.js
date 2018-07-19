import menuInfo from '../../json/menuInfo.json';

export const Avatar = require('./Avatar.png');
export const AppIcon = require('./AppIcon.png');
export const Logo = require('./Logo.png');

export const Approval = require('./Approval.png');
export const DOCustomer = require('./DOCustomer.png');
export const ViewRequest = require('./ViewRequest.png');
export const MyConfirmation = require('./MyConfirmation.png');
export const MyRequest = require('./MyRequest.png');

export const UserManual = require('./UserManual.png');
export const FAQ = require('./FAQ.png');
export const Test = require('./Test.png');

export const Information = require('./Information.png');
export const InformationWhite = require('./InformationWhite.png');
export const Link = require('./Link.png');
export const LinkWhite = require('./LinkWhite.png');

export const TakePicture = require('./TakePicture.png');
export const Gallery = require('./Gallery.png');

export const Sidebar = require('./Sidebar.png');

/**
 * Maps IDs to relevant icon or image reference
 * @param {Number} id: Menu ID to use as search reference 
 * @param {String} type: Image type in case there are variants of the same image 
 */
export function getIcon(id, type) {
    switch (id) {
        case menuInfo.Constants.WORKSPACE: return { name: 'briefcase', type: 'font-awesome' };
        case menuInfo.Constants.MYREQUEST: return MyRequest;
        case menuInfo.Constants.APPROVAL: return Approval;
        case menuInfo.Constants.DOCUSTOMER: return DOCustomer;
        case menuInfo.Constants.MYCONFIRMATION: return MyConfirmation
        case menuInfo.Constants.VIEW: return ViewRequest;
        case menuInfo.Constants.HELP: return { name: 'help-circle', type: 'material-community' };
        case menuInfo.Constants.SETTING: return { name: 'gears', type: 'font-awesome' };
        case menuInfo.Constants.QRSCANNER: return { name: 'qrcode', type: 'material-community' };
        case menuInfo.Constants.LINK:
            if (type === 'white')
                return LinkWhite;
            else
                return Link;
        case menuInfo.Constants.INFORMATION:
            if (type === 'white')
                return InformationWhite;
            else
                return Information;
    }
}

