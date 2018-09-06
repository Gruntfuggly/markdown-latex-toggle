## `1` GUI

The CMS GUI will be a subsystem plugin for iVENCS. It will contain a set of tabs:

<!-- <REMOVE> -->
<!-- - [BI/PMS Tab](#bipms-tab) -->
<!-- - [Assets Tab](#assets-tab) -->
<!-- - [Rules Tab](#rules-tab) -->
<!-- - [Active Events Tab](#active-events-tab) -->
<!-- - [Event History Tab](#event-history-tab) -->
<!-- - [Data Log Tab](#data-log-tab) -->
<!-- - [Alarm List Tab](#alarm-list-tab) -->
<!-- - [Status Tree Tab](#status-tree-tab) -->
<!-- <REMOVE> -->

At the bottom of the page (on all tabs) will be an alarm summary and a list of active event counts grouped by urgency or severity.

### `1.1` BI/PMS Tab

<img alt="BI/PMS Tab Wireframe" src="CMS Mockup - BI_PMS.jpg">

This tab contains a web view with a toolbar, and a set of buttons to visit pre-configured URLs, such as for Tableau BI and PMS views, Reports, etc. The toolbar will provide standard *Page Back*, *Page Forward* and *Page Reload* buttons. The toolbar will also show a read-only text box indicating the current URL.


### `1.2` Assets Tab

<img alt="Assets Tab Wireframe" src="CMS Mockup - Assets.jpg">

This tab primarily contains a table showing a list of configured assets.

A row of buttons below the table provide access to the following functions for configuring the asset list:

    - Add
    - Delete
    - Modify
    - Refresh
    - Import
    - Export

There are also controls on this tab to search and filter the asset list.

#### `1.2.1` Assets Table
The table has the following coloumns:

    - `1.2.1.1` Serial Number
    - `1.2.1.2` Code
    - `1.2.1.3` Description
    - `1.2.1.4` Type
    - `1.2.1.5` Location
    - `1.2.1.6` Subsystem
    - `1.2.1.7` Severity
    - `1.2.1.8` Urgency

##### `1.2.1.1` Severity and Urgency Columns

The Severity and Urgency columns show the current highest event severity and current highest event urgency for each asset.

    1. One
    1. Two
        - A
            1. x
            1. y
            1. z
        1. B
        1. C
    1. Three

### This should be OK.