import * as img from '../assets/images';

/**
 * This file is the gateway between IDs and Names from API and Apps
 */

//Maps constants of internal names to ID from database for internal references
export const ID = {
    ROOT: 7540,
    WORKSPACE: 7546,
    MYREQUEST: 7552,
    APPROVAL: 7556,
    DOCUSTOMER: 7559,
    MYCONFIRMATION: 7560,
    VIEW: 7562,
    HELP: 7564,
    SETTING: 7565,
    QRSCANNER: 7566,
    LINK: 7575,
    INFORMATION: 7576
};

/**
 * Maps IDs to relevant icon or image reference
 * @param {Number} id: Menu ID to use as search reference 
 * @param {String} type: Image type in case there are variants of the same image 
 */
export function IDtoIcon(id, type) {
    switch (id) {
        case ID.WORKSPACE: return { name: 'briefcase', type: 'font-awesome' };
        case ID.MYREQUEST: return img.MyRequest;
        case ID.APPROVAL: return img.Approval;
        case ID.DOCUSTOMER: return img.DOCustomer;
        case ID.MYCONFIRMATION: return img.MyConfirmation
        case ID.VIEW: return img.ViewRequest;
        case ID.HELP: return { name: 'help-circle', type: 'material-community' };
        case ID.SETTING: return { name: 'gears', type: 'font-awesome' };
        case ID.QRSCANNER: return { name: 'qrcode', type: 'material-community' };
        case ID.LINK:
            if (type === 'white')
                return img.LinkWhite;
            else
                return img.Link;
        case ID.INFORMATION:
            if (type === 'white')
                return img.InformationWhite;
            else
                return img.Information;
    }
}

/**
 * Maps IDs to relevant internal page names
 * @param {Number} id: Menu ID to use as search reference
 */
export function IDtoName(id) {
    switch (id) {
        case ID.WORKSPACE: return "Workspace";
        case ID.MYREQUEST: return "My Request";
        case ID.APPROVAL: return "Approval"
        case ID.DOCUSTOMER: return "DO Customer";
        case ID.MYCONFIRMATION: return "My Confirmation";
        case ID.VIEW: return "View";
        case ID.HELP: return "Help";
        case ID.SETTING: return "Setting";
        case ID.QRSCANNER: return "QR Scanner";
        case ID.LINK: return "Link";
        case ID.INFORMATION: return "Information";
    }
}