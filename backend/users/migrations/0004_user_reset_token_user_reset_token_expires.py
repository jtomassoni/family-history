# Generated by Django 5.2 on 2025-04-11 04:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_user_has_clicked_activation_link_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='reset_token',
            field=models.UUIDField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='reset_token_expires',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
