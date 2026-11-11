// XML bodies in the shapes Worksnaps sends, with made-up ids and names.
// They were not captured from the live API.

export const projectsXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<projects type="array">\n' +
	'  <project>\n' +
	'    <id type="integer">3456</id>\n' +
	'    <name>Acme storefront</name>\n' +
	'    <description>Front-end work</description>\n' +
	'  </project>\n' +
	'  <project>\n' +
	'    <id type="integer">3457</id>\n' +
	'    <name>Acme backend</name>\n' +
	'    <description nil="true"></description>\n' +
	'  </project>\n' +
	'</projects>\n';

export const projectXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<project>\n' +
	'  <id type="integer">3456</id>\n' +
	'  <name>Acme storefront</name>\n' +
	'  <description>Front-end work</description>\n' +
	'</project>\n';

export const tasksXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<tasks type="array">\n' +
	'  <task>\n' +
	'    <id type="integer">78</id>\n' +
	'    <project_id type="integer">3456</project_id>\n' +
	'    <name>Build the cart</name>\n' +
	'    <description></description>\n' +
	'  </task>\n' +
	'</tasks>\n';

export const taskXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<task>\n' +
	'  <id type="integer">78</id>\n' +
	'  <project_id type="integer">3456</project_id>\n' +
	'  <name>Build the cart</name>\n' +
	'</task>\n';

export const timeEntriesXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<time_entries type="array">\n' +
	'  <time_entry>\n' +
	'    <id type="integer">901</id>\n' +
	'    <task_id type="integer">78</task_id>\n' +
	'    <user_id type="integer">12</user_id>\n' +
	'    <from_timestamp>2024-06-01T09:00:00Z</from_timestamp>\n' +
	'    <duration_in_minutes type="integer">90</duration_in_minutes>\n' +
	'    <user_comment>Worked on the cart</user_comment>\n' +
	'  </time_entry>\n' +
	'  <time_entry>\n' +
	'    <id type="integer">902</id>\n' +
	'    <task_id type="integer">78</task_id>\n' +
	'    <user_id type="integer">12</user_id>\n' +
	'    <from_timestamp>2024-06-01T11:00:00Z</from_timestamp>\n' +
	'    <duration_in_minutes type="integer">30</duration_in_minutes>\n' +
	'    <user_comment></user_comment>\n' +
	'  </time_entry>\n' +
	'</time_entries>\n';

export const timeEntryXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<time_entry>\n' +
	'  <id type="integer">901</id>\n' +
	'  <task_id type="integer">78</task_id>\n' +
	'  <from_timestamp>2024-06-01T09:00:00Z</from_timestamp>\n' +
	'  <duration_in_minutes type="integer">90</duration_in_minutes>\n' +
	'  <user_comment>Worked on the cart</user_comment>\n' +
	'</time_entry>\n';

export const taskAssignmentsXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<task_assignments type="array">\n' +
	'  <task_assignment>\n' +
	'    <id type="integer">55</id>\n' +
	'    <task_id type="integer">78</task_id>\n' +
	'    <user_id type="integer">12</user_id>\n' +
	'  </task_assignment>\n' +
	'</task_assignments>\n';

export const taskAssignmentXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<task_assignment>\n' +
	'  <id type="integer">55</id>\n' +
	'  <task_id type="integer">78</task_id>\n' +
	'  <user_id type="integer">12</user_id>\n' +
	'</task_assignment>\n';

export const userAssignmentsXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<user_assignments type="array">\n' +
	'  <user_assignment>\n' +
	'    <id type="integer">21</id>\n' +
	'    <user_id type="integer">12</user_id>\n' +
	'    <project_id type="integer">3456</project_id>\n' +
	'    <role>member</role>\n' +
	'    <hourly_rate type="float">45.5</hourly_rate>\n' +
	'    <flag_allow_logging_time type="boolean">true</flag_allow_logging_time>\n' +
	'    <window_for_deleting_time type="integer">7</window_for_deleting_time>\n' +
	'    <window_for_adding_offline_time type="integer">2</window_for_adding_offline_time>\n' +
	'  </user_assignment>\n' +
	'</user_assignments>\n';

export const userAssignmentXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<user_assignment>\n' +
	'  <id type="integer">21</id>\n' +
	'  <user_id type="integer">12</user_id>\n' +
	'  <role>member</role>\n' +
	'  <hourly_rate type="float">45.5</hourly_rate>\n' +
	'</user_assignment>\n';

export const usersXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<users type="array">\n' +
	'  <user>\n' +
	'    <id type="integer">12</id>\n' +
	'    <login>jordan</login>\n' +
	'    <first_name>Jordan</first_name>\n' +
	'    <last_name>Ruiz</last_name>\n' +
	'    <email>jordan@acme.example</email>\n' +
	'  </user>\n' +
	'</users>\n';

export const userXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<user>\n' +
	'  <id type="integer">12</id>\n' +
	'  <login>jordan</login>\n' +
	'  <first_name>Jordan</first_name>\n' +
	'  <last_name>Ruiz</last_name>\n' +
	'  <email>jordan@acme.example</email>\n' +
	'</user>\n';

export const meXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<user>\n' +
	'  <id type="integer">12</id>\n' +
	'  <login>jordan</login>\n' +
	'  <first_name>Jordan</first_name>\n' +
	'  <last_name>Ruiz</last_name>\n' +
	'</user>\n';

export const projectReportXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<report>\n' +
	'  <total_minutes type="integer">2400</total_minutes>\n' +
	'  <total_hours type="float">40.0</total_hours>\n' +
	'  <user_count type="integer">3</user_count>\n' +
	'</report>\n';

export const summaryReportXml =
	'<?xml version="1.0" encoding="UTF-8"?>\n' +
	'<summary_report>\n' +
	'  <total_minutes type="integer">9800</total_minutes>\n' +
	'  <project_count type="integer">4</project_count>\n' +
	'</summary_report>\n';
