import { App, PluginSettingTab, Setting } from "obsidian";
import TodoistCompletedTasks from "../main";

export class TodoistPluginSettingTab extends PluginSettingTab {
	plugin: TodoistCompletedTasks;

	constructor(app: App, plugin: TodoistCompletedTasks) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h1", { text: "Todoist Completed Tasks" });
		containerEl.createEl("a", {
			text: "Important - see usage instructions",
			href: "https://github.com/Ledaryy/obsidian-todoist-completed-tasks",
		});

		this.addApiKeySetting(containerEl);
		this.addStartLineDetector(containerEl);
		this.addEndLineDetector(containerEl);
		this.addTaskPrefix(containerEl);
		this.addSubtaskRenderSwitch(containerEl);
	}

	private addApiKeySetting(containerEl: HTMLElement) {
		const fieldDescription = document.createDocumentFragment();
		fieldDescription.createEl("span", null, (span) => {
			span.innerText =
				"This is your personal authentication token for Todoist. Be aware that anyone with this token " +
				"could access all of your Todoist data. This is stored in plain text in your .obsidian/plugins folder." +
				" Ensure that you are comfortable with the security implications before proceeding. " +
				'\nYou can get your token from the "API token" section ';

			span.createEl("a", null, (link) => {
				link.href = "https://todoist.com/prefs/integrations";
				link.innerText = "here.";
			});
		});
		new Setting(containerEl)
			.setName("API token")
			.setDesc(fieldDescription)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.authToken)
					.onChange(async (value) => {
						this.plugin.settings.authToken = value;
						await this.plugin.saveSettings();
					})
			);
	}
	private addStartLineDetector(containerEl: HTMLElement) {
		const fieldDescription = document.createDocumentFragment();
		fieldDescription.createEl("span", null, (span) => {
			span.innerText =
				"Segment for the plugin to detect the start of tasks. " +
				"\nSupports Obsidian's comments syntax.";
		});
		new Setting(containerEl)
			.setName("Start line detector")
			.setDesc(fieldDescription)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.keywordSegmentStart)
					.onChange(async (value) => {
						this.plugin.settings.keywordSegmentStart = value;
						await this.plugin.saveSettings();
					})
			);
	}
	private addEndLineDetector(containerEl: HTMLElement) {
		const fieldDescription = document.createDocumentFragment();
		fieldDescription.createEl("span", null, (span) => {
			span.innerText =
				"Segment for the plugin to detect the end of tasks. " +
				"\nSupports Obsidian's comments syntax.";
		});
		new Setting(containerEl)
			.setName("End line detector")
			.setDesc(fieldDescription)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.keywordSegmentEnd)
					.onChange(async (value) => {
						this.plugin.settings.keywordSegmentEnd = value;
						await this.plugin.saveSettings();
					})
			);
	}
	private addTaskPrefix(containerEl: HTMLElement) {
		const fieldDescription = document.createDocumentFragment();
		fieldDescription.createEl("span", null, (span) => {
			span.innerText =
				"Set prefix for tasks. Popular usecases:" +
				'\nBullet points "*" ' +
				'\nCompleted checkboxes "- [x]"' +
				'\nIt also supports the special parameter "$AUTOINCREMENT" ' +
				"which will be replaced with an auto-increment number." +
				"\nFor all other parameters, refer to the ";
			span.createEl("a", null, (link) => {
				link.href = "https://www.markdownguide.org/tools/obsidian/";
				link.innerText = "Obsidian Markdown";
			});
		});
		new Setting(containerEl)
			.setName("Prefix")
			.setDesc(fieldDescription)
			.addText((text) =>
				text
					.setValue(this.plugin.settings.taskPrefix)
					.onChange(async (value) => {
						this.plugin.settings.taskPrefix = value;
						await this.plugin.saveSettings();
					})
			);
	}

	private addSubtaskRenderSwitch(containerEl: HTMLElement) {
		const fieldDescription = document.createDocumentFragment();
		fieldDescription.createEl("span", null, (span) => {
			span.innerText =
				"You should disable this if you want to load more than 30 (up to 200) tasks. " +
				"This is due to a limitation of the Todoist API." +
				"\nIf enabled, subtasks will be rendered as subtasks. " +
				"\nIf disabled, subtasks will be rendered as normal tasks." +
				"\nDramatically increases loading time if enabled.";
		});
		new Setting(containerEl)
			.setName("Render subtasks")
			.setDesc(fieldDescription)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.renderSubtasks)
					.onChange(async (value) => {
						this.plugin.settings.renderSubtasks = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
