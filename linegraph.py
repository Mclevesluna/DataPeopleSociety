import pandas as pd
import matplotlib.pyplot as plt
#please pip install ipywidgets
from matplotlib import dates as mdates
import ipywidgets as widgets
from IPython.display import display

# Load the CSV file into a DataFrame
file_path = 'data/export.csv'
df = pd.read_csv(file_path)

# Convert the 'Local Date/Time' column to datetime
df['Local Date/Time'] = pd.to_datetime(df['Local Date/Time'])

# Filter the data for the specified date range
start_date = '2024-05-01'
end_date = '2024-06-01'
df = df[(df['Local Date/Time'] >= start_date) & (df['Local Date/Time'] < end_date)]

# Remove duplicate indices
df = df[~df['Local Date/Time'].duplicated()]

# Set 'Local Date/Time' as the index
df.set_index('Local Date/Time', inplace=True)

# Resample the data to get readings near noon and midnight
df_resampled = df.resample('12H').nearest()

# Location filter
locations = ['All'] + df['Location Name'].unique().tolist()
location_filter = widgets.Dropdown(options=locations, value='All', description='Location:')

# Location Type filter
location_types = ['All'] + df['Location Type'].unique().tolist()
location_type_filter = widgets.Dropdown(options=location_types, value='All', description='Location Type:')

# Function to handle hover event
def on_hover(event):
    if event.xdata is not None:
        plt.gca().lines[0].set_alpha(0.3)  # Set the opacity of lines
        plt.gca().lines[1].set_alpha(0.3)
        plt.gca().lines[2].set_alpha(0.3)
        ax.axvline(event.xdata, color='gray', linestyle='--', linewidth=1)  # Add vertical line at hover position
        plt.gca().text(event.xdata, plt.gca().get_ylim()[1], pd.Timestamp(event.xdata).strftime('%Y-%m-%d %I:%M %p'), ha='right', fontsize=10, color='gray')  # Show date and time
        plt.draw()
    else:
        plt.gca().lines[0].set_alpha(1.0)  # Reset opacity when not hovering
        plt.gca().lines[1].set_alpha(1.0)
        plt.gca().lines[2].set_alpha(1.0)
        plt.gca().lines[3].set_alpha(1.0)
        ax.lines.pop()  # Remove vertical line
        ax.texts.pop()  # Remove text

# Connect the hover event
plt.gcf().canvas.mpl_connect('motion_notify_event', on_hover)

# Function to update plot based on location filter
def plot_data(location, location_type):
    plt.figure(figsize=(18, 10))
    
    if location == 'All':
        df_filtered = df_resampled
    else:
        df_filtered = df_resampled[df_resampled['Location Name'] == location]
    
    if location_type != 'All':
        df_filtered = df_filtered[df_filtered['Location Type'] == location_type]

    # Plotting the specified columns
    plt.plot(df_filtered.index, df_filtered['PM2.5 (μg/m³)'], label='PM2.5 (μg/m³)', linestyle='-', marker='o')
    plt.plot(df_filtered.index, df_filtered['PM1 (μg/m³)'], label='PM1 (μg/m³)', linestyle=':', marker='d')
    plt.plot(df_filtered.index, df_filtered['PM10 (μg/m³)'], label='PM10 (μg/m³)', linestyle='-', marker='x')

    # Format the x-axis to show date and time
    ax = plt.gca()
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %d\n%p'))
    ax.xaxis.set_major_locator(mdates.HourLocator(interval=24*5))  # Show labels every 5 days
    
    # Add labels and title
    plt.xlabel('Date/Time')
    plt.ylabel('Values')
    plt.title('Air Quality Measurements Over Time')
    plt.legend()
    
    # Add grid for better readability
    plt.grid(True)
    
    # Show the plot
    plt.tight_layout()  # Adjust layout to make room for labels
    plt.show()

# Display location and location type filters
display(widgets.HBox([location_filter, location_type_filter]))

# Plot data initially
plot_data('All', 'All')

# Update plot when filters change
def update_plot(change):
    plot_data(location_filter.value, location_type_filter.value)

location_filter.observe(update_plot, names='value')
location_type_filter.observe(update_plot, names='value')