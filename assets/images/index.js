import menuInfo from '../../json/menuInfo.json';

export const img =
{
    app: {
        Avatar: require('./Avatar.png'),
        AppIcon: require('./AppIcon.png'),
        Logo: require('./AppLogo.png'),
    },
    menu: {
        Approval: require('./Approval.png'),
        DOCustomer: require('./DOCustomer.png'),
        Report: require('./Report.png'),
        MyConfirmation: require('./MyConfirmation.png'),
        MyRequest: require('./MyRequest.png'),
        View: require('./View.png'),
        TaskList: require('./TaskList.png'),

        UserManual: require('./UserManual.png'),
        FAQ: require('./FAQ.png'),
        Test: require('./Test.png'),

        Information: require('./Information.png'),
        InformationWhite: require('./InformationWhite.png'),
        Link: require('./Link.png'),
        LinkWhite: require('./LinkWhite.png'),

        TakePicture: require('./TakePicture.png'),
        Gallery: require('./Gallery.png'),
    },
    formStatus: {
        "Open": { name: 'open-book', type: 'entypo', color: '#ffb732' },
        "Approve": { name: 'checklist', type: 'octicon', color: '#3CB371' },
        "Escalated": { name: 'mail-forward', type: 'font-awesome', color: '#ffae19' },
        "Deliver": { name: 'truck-fast', type: 'material-community', color: '#8B4513' },
        "On Warehouse": { name: 'garage', type: 'material-community', color: '#8B4513' },
        "On PO": { name: 'basket', type: 'simple-line-icon', color: '#05B8CC' },
        "Complate PO": { name: 'basket-loaded', type: 'simple-line-icon', color: '#05B8CC' },
        "Cancel": { name: 'cancel', type: 'material-community', color: '#ff3030' },
        "Reject": { name: 'close-octagon-outline', type: 'material-community', color: '#ff3030' },
        "Finish": { name: 'checkbox-marked-circle-outline', type: 'material-community', color: '#6B8E23' }
    },
    itemStatus: {
        "Open": { name: 'open-book', type: 'entypo', color: '#ffb732' },
        "Approved": { name: 'checklist', type: 'octicon', color: '#3CB371' },
        "Escalated": { name: 'mail-forward', type: 'font-awesome', color: '#ffae19' },
        "Deliver Partial": { name: 'arrange-send-to-back', type: 'material-community', color: '#8B4513' },
        "Deliver": { name: 'truck-fast', type: 'material-community', color: '#8B4513' },
        "Handle": { name: 'garage', type: 'material-community', color: '#8B4513' },
        "On PO": { name: 'basket', type: 'simple-line-icon', color: '#05B8CC' },
        "Complate PO": { name: 'basket-loaded', type: 'simple-line-icon', color: '#05B8CC' },
        "Cancel": { name: 'cancel', type: 'material-community', color: '#ff3030' },
        "Reject": { name: 'close-octagon-outline', type: 'material-community', color: '#ff3030' },
        "Finish": { name: 'account-check', type: 'material-community', color: '#6B8E23' }
    }
};

/**
 * Maps IDs to relevant icon or image reference
 * @param {Number} id: Menu ID to use as search reference 
 * @param {String} type: Image type in case there are variants of the same image 
 */
export function getIcon(id, type) {
    switch (id) {
        case menuInfo.Constants.WORKSPACE: return { name: 'briefcase', type: 'font-awesome' };
        case menuInfo.Constants.MYREQUEST: return img.menu.MyRequest;
        case menuInfo.Constants.APPROVAL: return img.menu.Approval;
        case menuInfo.Constants.DOCUSTOMER: return img.menu.DOCustomer;
        case menuInfo.Constants.MYCONFIRMATION: return img.menu.MyConfirmation
        case menuInfo.Constants.REPORT: return img.menu.Report;
        case menuInfo.Constants.VIEW: return img.menu.View;
        case menuInfo.Constants.TASKLIST: return img.menu.TaskList;
        case menuInfo.Constants.HELP: return { name: 'help-circle', type: 'material-community' };
        case menuInfo.Constants.SETTING: return { name: 'gears', type: 'font-awesome' };
        case menuInfo.Constants.QRSCANNER: return { name: 'qrcode', type: 'material-community' };
        case menuInfo.Constants.LINK:
            if (type === 'white')
                return img.menu.LinkWhite;
            else
                return img.menu.Link;
        case menuInfo.Constants.INFORMATION:
            if (type === 'white')
                return img.menu.InformationWhite;
            else
                return img.menu.Information;
    }
}

